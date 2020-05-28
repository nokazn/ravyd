import { Actions } from 'vuex';

import { PlayerState } from './state';
import { PlayerGetters } from './getters';
import { PlayerMutations } from './mutations';
import { REPEAT_STATE_LIST } from '~/variables';
import { SpotifyAPI } from '~~/types';

export type PlayerActions = {
  initPlayer: () => void
  disconnectPlayer: () => void
  getRecentlyPlayed: (limit?: number) => Promise<void>
  transferPlayback: ({ deviceId, play }: {
    deviceId: string
    play?: boolean
  }) => Promise<void>
  getActiveDeviceList: () => Promise<void>
  play: (payload?: {
    contextUri: string
    trackUriList?: undefined
    offset?: {
      uri: string
      position?: undefined
    }
  } | {
    contextUri?: undefined
    trackUriList: string[]
    offset?: {
      uri?: undefined
      position: number
    }
  }) => Promise<void>
  pause: (payload?: { isInitializing: boolean }) => Promise<void>
  seek: (positionMs: number) => Promise<void>
  next: () => Promise<void>
  previous: () => Promise<void>
  shuffle: () => Promise<void>
  repeat: () => Promise<void>
  volume: ({ volumePercent }: { volumePercent: number }) => Promise<void>
  mute: () => Promise<void>
  checkSavedTracks: (trackIds?: string) => Promise<void>
};

export type RootActions = {
  'player/initPlayer': PlayerActions['initPlayer']
  'player/transferPlayback': PlayerActions['transferPlayback']
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
  'player/mute': PlayerActions['mute']
  'player/checkSavedTracks': PlayerActions['checkSavedTracks']
};

const actions: Actions<PlayerState, PlayerActions, PlayerGetters, PlayerMutations> = {
  initPlayer({
    state,
    commit,
    getters,
    dispatch,
    rootState,
  }) {
    const token = rootState.auth.accessToken;
    if (token == null) {
      window.onSpotifyWebPlaybackSDKReady = () => {};
      return;
    }

    window.onSpotifyWebPlaybackSDKReady = async () => {
      // player が登録されていないときのみ初期化
      if (getters.isPlayerConnected) return;

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
      player.addListener('player_state_changed', ((playerState) => {
        // playerState は Nullable
        if (playerState == null) return;

        // @todo
        console.log(playerState);
        const {
          position,
          duration,
          paused: isPaused,
          shuffle: isShuffled,
          // repeat_mode: repeatMode,
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
        // 表示がちらつくので、player/repeat 内で commit する
        // commit('SET_REPEAT_MODE', repeatMode);
        commit('SET_CURRENT_TRACK', currentTrack);
        commit('SET_NEXT_TRACK_LIST', nextTracks);
        commit('SET_PREVIOUS_TRACK_LIST', previousTracks);
        commit('SET_DISALLOW_LIST', disallowList);

        const trackId = currentTrack.id;
        // trackId 変わったときだけチェック
        if (trackId != null && trackId !== lastTrackId) dispatch('checkSavedTracks', trackId);
      }));

      // Ready
      player.addListener('ready', async ({ device_id }) => {
        // デバイスをアクティブにする前に再生を止めないとアクティブにした後勝手に再生される可能性があるらしい
        await dispatch('pause', { isInitializing: true });
        await dispatch('transferPlayback', {
          deviceId: device_id,
          play: false,
        });

        // volme は 0 から 1
        const [volume] = await Promise.all([
          player.getVolume().catch((err: Error) => {
            console.error({ err });
            return 1;
          }),
          dispatch('getActiveDeviceList'),
        ] as const);

        commit('SET_VOLUME', { volumePercent: volume * 100 });

        console.log('Ready with this device 🎉');
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('This device has gone offline 😴', device_id);
      });

      // Connect to the player
      await player.connect();

      commit('SET_PLAYBACK_PLAYER', player);
    };

    window.onSpotifyWebPlaybackSDKReady();
  },

  disconnectPlayer({ state, commit }) {
    const { playbackPlayer } = state;
    if (playbackPlayer == null) return;

    playbackPlayer.disconnect();
    commit('SET_PLAYBACK_PLAYER', null);
  },

  async transferPlayback({ state, commit, dispatch }, { deviceId, play }) {
    if (deviceId === state.deviceId) return;

    // play が指定されなかった場合は、現在の状態を維持
    await this.$spotify.player.transferPlayback({
      deviceId,
      play: play != null
        ? play
        : state.isPlaying,
    });

    commit('SET_DEVICE_ID', deviceId);

    const playingDevice = state.activeDeviceList.find((device) => device.id === deviceId);
    if (playingDevice != null) {
      // 再生されているデバイスの isActive を true にする
      const activeDeviceList: SpotifyAPI.Device[] = state.activeDeviceList.map((device) => ({
        ...device,
        is_active: device.id === deviceId,
      }));
      commit('SET_ACTIVE_DEVICE_LIST', activeDeviceList);
    } else {
      // デバイスのリストを取得しなおす
      await dispatch('getActiveDeviceList');
    }
  },

  async getActiveDeviceList({ state, commit }) {
    const { devices } = await this.$spotify.player.getActiveDeviceList();

    commit('SET_ACTIVE_DEVICE_LIST', devices ?? []);

    const playingDevice = state.activeDeviceList.find((device) => device.id === state.deviceId);
    if (playingDevice?.id != null) commit('SET_DEVICE_ID', playingDevice.id);
  },

  async getRecentlyPlayed({ commit }, limit = 20) {
    const recentlyPlayed = await this.$spotify.player.getRecentlyPlayed({ limit });

    commit('SET_RECENTLY_PLAYED', recentlyPlayed);
  },

  /**
   * contextUri が album/playlist の時のみに offset.uri が有効
   * trackUriList が指定された時のみに offset.position が有効
   */
  async play({ state, commit }, payload?) {
    const { deviceId } = state;
    const contextUri = payload?.contextUri;
    const trackUriList = payload?.trackUriList;
    const offset = payload?.offset;

    const isNotUriPassed = contextUri == null && trackUriList == null;
    const isRestartingContext = state.trackUri === offset?.uri;
    const isRestartingTracks = trackUriList != null
      && offset?.position != null
      && state.trackUri === trackUriList[offset.position];

    await this.$spotify.player.play(
      // uri が指定されなかったか、指定した uri がセットされているトラックと同じ場合は一時停止を解除
      isNotUriPassed || isRestartingContext || isRestartingTracks
        ? {
          deviceId,
          positionMs: state.position,
        }
        : {
          deviceId,
          contextUri,
          trackUriList,
          offset,
        },
    );

    commit('SET_IS_PLAYING', true);
  },

  async pause({ state, commit }, payload = { isInitializing: false }) {
    const { deviceId } = state;
    const isInitializing = payload?.isInitializing;
    await this.$spotify.player.pause(isInitializing
      ? { isInitializing }
      : { deviceId });

    commit('SET_IS_PLAYING', false);
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

  async shuffle({ state, commit }) {
    const { deviceId, isShuffled } = state;
    const nextIsShuffled = !isShuffled;
    await this.$spotify.player.shuffle({
      deviceId,
      state: nextIsShuffled,
    });

    commit('SET_IS_SHUFFLED', nextIsShuffled);
  },

  async repeat({ state, commit }) {
    const { deviceId } = state;
    const nextRepeatMode = (state.repeatMode + 1) % REPEAT_STATE_LIST.length as 0 | 1 | 2;
    await this.$spotify.player.repeat({
      deviceId,
      state: REPEAT_STATE_LIST[nextRepeatMode],
    });

    commit('SET_REPEAT_MODE', nextRepeatMode);
  },

  async volume({ state, commit }, { volumePercent }) {
    const { deviceId } = state;
    await this.$spotify.player.volume({
      deviceId,
      volumePercent,
    });

    commit('SET_VOLUME', { volumePercent });
  },

  async mute({ state, commit }) {
    const { isMuted, deviceId, volume } = state;
    const nextMuteState = !isMuted;
    const volumePercent = nextMuteState ? 0 : volume;
    await this.$spotify.player.volume({
      deviceId,
      volumePercent,
    });

    commit('SET_IS_MUTED', nextMuteState);
  },

  async checkSavedTracks({ state, commit }, trackId?) {
    if (state.trackId == null) return;

    const [isSavedTrack] = await this.$spotify.library.checkUserSavedTracks({
      trackIdList: [trackId ?? state.trackId],
    }).catch((err: Error) => {
      console.error({ err });
      return [false];
    });

    commit('SET_IS_SAVED_TRACK', isSavedTrack);
  },
};

export default actions;
