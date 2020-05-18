import { Actions } from 'vuex';

import { PlayerState } from './state';
import { PlayerGetters } from './getters';
import { PlayerMutations } from './mutations';
import { REPEAT_STATE_LIST } from '~/variables';

export type PlayerActions = {
  initPlayer: () => void
  getRecentlyPlayed: (limit?: number) => Promise<void>
  getActiveDeviceList: () => Promise<void>
  play: (payload?: {
    contextUri: string
    trackUriList?: undefined
    offset?: {
      uri: string
    }
  } | {
    contextUri?: undefined
    trackUriList: string[]
    offset?: {
      uri: string
    }
  }) => Promise<void>
  pause: (payload?: { isInitializing: boolean }) => Promise<void>
  seek: (positionMs: number) => Promise<void>
  next: () => Promise<void>
  previous: () => Promise<void>
  shuffle: () => Promise<void>
  repeat: () => Promise<void>
  volume: ({ volumePercent }: { volumePercent: number }) => Promise<void>
  checkSavedTracks: (trackIds?: string) => Promise<void>
};

export type RootActions = {
  'player/initPlayer': PlayerActions['initPlayer']
  'player/getActiveDeviceList': PlayerActions['getActiveDeviceList']
  'player/getRecentlyPlayed': PlayerActions['getRecentlyPlayed']
  'player/play': PlayerActions['play']
  'player/pause': PlayerActions['pause']
  'player/seek': PlayerActions['seek']
  'player/next': PlayerActions['next']
  'player/previous': PlayerActions['previous']
  'player/shuffle': PlayerActions['shuffle']
  'player/repeat': PlayerActions['repeat']
  'player/volume': PlayerActions['volume']
  'player/checkSavedTracks': PlayerActions['checkSavedTracks']
};

let playbackPlayer: Spotify.SpotifyPlayer;

const actions: Actions<PlayerState, PlayerActions, PlayerGetters, PlayerMutations> = {
  initPlayer({
    state,
    commit,
    dispatch,
    rootState,
  }) {
    const token = rootState.auth.accessToken;
    if (token == null) {
      window.onSpotifyWebPlaybackSDKReady = () => {};
      return;
    }

    window.onSpotifyWebPlaybackSDKReady = async () => {
      // player が登録されている場合は無効化する
      if (playbackPlayer != null) playbackPlayer.disconnect();

      const player = new Spotify.Player({
        // @todo
        name: 'spotify-player',
        getOAuthToken: (cb) => {
          cb(token);
        },
      });

      // Error handling
      const errorList: Spotify.ErrorTypes[] = [
        'initialization_error',
        'account_error',
        'playback_error',
      ];
      errorList.forEach((errorType) => {
        player.addListener(errorType, (err) => {
          console.error(err);
        });
      });

      // 認証エラーが発生した場合
      player.addListener('authentication_error', async (err) => {
        console.error({ err });
        await dispatch('auth/refreshAccessToken', undefined, { root: true });
        if (rootState.auth.accessToken == null) dispatch('auth/logout', undefined, { root: true });
      });

      // Playback status updates
      player.addListener('player_state_changed', (playerState) => {
        const {
          position,
          duration,
          paused: isPaused,
          shuffle: isShuffled,
          repeat_mode: repeatMode,
          track_window: {
            current_track: currentTrack,
            next_tracks: nextTracks,
            previous_tracks: previousTracks,
          },
          disallows,
        } = playerState;
        const lastTrackId = state.trackId;
        const disallowKeys = Object.keys(disallows) as Array<keyof typeof disallows>;
        const disallowList = disallowKeys.filter((key) => disallows[key]);

        commit('SET_IS_PLAYING', !isPaused);
        commit('SET_POSITION', position);
        commit('SET_DURATION', duration);
        commit('SET_IS_SHUFFLED', isShuffled);
        commit('SET_REPEAT_MODE', repeatMode);
        commit('SET_CURRENT_TRACK', currentTrack);
        commit('SET_NEXT_TRACK_LIST', nextTracks);
        commit('SET_PREVIOUS_TRACK_LIST', previousTracks);
        commit('SET_DISALLOW_LIST', disallowList);

        const trackId = currentTrack.id;
        // trackId 変わったときだけチェック
        if (trackId != null && trackId !== lastTrackId) dispatch('checkSavedTracks', trackId);

        // @todo
        console.log(playerState);
      });

      // Ready
      player.addListener('ready', async ({ device_id }) => {
        commit('SET_DEVICE_ID', device_id);
        // デバイスをアクティブにする前に再生を止めないとアクティブにした後勝手に再生される可能性があるらしい
        await dispatch('pause', { isInitializing: true });
        await this.$spotify.player.transferPlayback({
          deviceIdList: [device_id],
          play: false,
        });

        // volme は 0 から 1
        const volume = await player.getVolume()
          .catch((err: Error) => {
            console.error({ err });
            return 1;
          });
        commit('SET_VOLUME', { volumePercent: volume * 100 });

        console.log('Ready with this device 🎉');
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('This device has gone offline 😴', device_id);
      });

      // Connect to the player
      await player.connect();
      playbackPlayer = player;
    };

    window.onSpotifyWebPlaybackSDKReady();
  },

  async getActiveDeviceList({ commit }) {
    const { devices } = await this.$spotify.player.getActiveDeviceList();
    commit('SET_ACTIVE_DEVICE_LIST', devices ?? []);
  },

  async getRecentlyPlayed({ commit }, limit = 20) {
    const recentlyPlayed = await this.$spotify.player.getRecentlyPlayed({ limit });
    commit('SET_RECENTLY_PLAYED', recentlyPlayed);
  },

  async play({ state, commit }, payload?) {
    commit('SET_IS_PLAYING', true);

    const { deviceId } = state;
    const contextUri = payload?.contextUri;
    const trackUriList = payload?.trackUriList;
    const offset = payload?.offset;
    // uri が指定されなかったか、指定した uri がセットされているトラックと同じ場合は一時停止中のトラックを再生
    const isRestartingCurrentTrack = (contextUri == null && trackUriList == null)
      || state.trackUri === offset?.uri;

    await this.$spotify.player.play(isRestartingCurrentTrack
      ? {
        deviceId,
        positionMs: state.position,
        offset,
      }
      : {
        deviceId,
        contextUri,
        trackUriList,
        offset,
      });
  },

  async pause({ state, commit }, payload = { isInitializing: false }) {
    commit('SET_IS_PLAYING', false);

    const { deviceId } = state;
    const isInitializing = payload?.isInitializing;
    await this.$spotify.player.pause(isInitializing
      ? { isInitializing }
      : { deviceId });
  },

  async seek({ state }, positionMs) {
    const { deviceId } = state;
    await this.$spotify.player.seek({
      deviceId,
      positionMs,
    });
  },

  async next({ state }) {
    const { deviceId } = state;
    await this.$spotify.player.next({ deviceId });
  },

  async previous({ state }) {
    const { deviceId } = state;
    await this.$spotify.player.previous({ deviceId });
  },

  async shuffle({ state }) {
    const { deviceId, isShuffled } = state;
    await this.$spotify.player.shuffle({
      deviceId,
      state: !isShuffled,
    });
  },

  async repeat({ state }) {
    const { deviceId } = state;
    const nextRepeatMode = (state.repeatMode + 1) % REPEAT_STATE_LIST.length as 0 | 1 | 2;
    await this.$spotify.player.repeat({
      deviceId,
      state: REPEAT_STATE_LIST[nextRepeatMode],
    });
  },

  async volume({ state, commit }, { volumePercent }) {
    const { deviceId } = state;
    await this.$spotify.player.volume({
      deviceId,
      volumePercent,
    });

    commit('SET_VOLUME', { volumePercent });
  },

  async checkSavedTracks({ state, commit }, trackId?) {
    const [isSavedTrack] = await this.$spotifyApi.$get('/me/tracks/contains', {
      params: {
        ids: trackId ?? state.trackId,
      },
    }).catch((err: Error) => {
      console.error({ err });
    });

    commit('SET_IS_SAVED_TRACK', isSavedTrack);
  },
};

export default actions;
