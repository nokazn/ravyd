import { Actions } from 'vuex';

import { PlayerState } from './state';
import { PlayerGetters } from './getters';
import { PlayerMutations } from './mutations';
import { SpotifyAPI } from '~~/types';
import { REPEAT_STATE_LIST } from '~/variables';

export type PlayerActions = {
  initPlayer: () => void
  getRecentlyPlayed: (limit?: number) => Promise<void>
  getActiveDeviceList: () => Promise<void>
  play: () => Promise<void>
  pause: () => Promise<void>
  seek: (position: number) => Promise<void>
  next: () => Promise<void>
  previous: () => Promise<void>
  shuffle: () => Promise<void>
  repeat: () => Promise<void>
  volume: (volume: number) => Promise<void>
  checkSavedTracks: (trackIds: string) => Promise<void>
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
  initPlayer({ commit, dispatch, rootState }) {
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
      player.addListener('player_state_changed', (state) => {
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
        } = state;
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
        if (trackId != null) dispatch('checkSavedTracks', trackId);

        // @todo
        console.log(state);
      });

      // Ready
      player.addListener('ready', async ({ device_id }) => {
        commit('SET_DEVICE_ID', device_id);
        // デバイスをアクティブにする前に再生を止めないとアクティブにした後勝手に再生される可能性があるらしい
        await dispatch('pause');
        await this.$spotifyApi.$put('/me/player/', {
          device_ids: [device_id],
        });

        // volme は 0 から 1
        const volume = await player.getVolume()
          .catch((err: Error) => {
            console.error({ err });
            return 1;
          });
        commit('SET_VOLUME', volume * 100);

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
    const { devices }: { devices: SpotifyAPI.Device[] } = await this.$spotifyApi.$get('/me/player/devices')
      .catch((err: Error) => {
        console.error(err);
        return null;
      });

    commit('SET_ACTIVE_DEVICE_LIST', devices);
  },

  async getRecentlyPlayed({ commit, dispatch }, limit = 10) {
    const recentlyPlayed = await this.$spotifyApi.$get('/me/player/recently-played', {
      params: {
        limit,
      },
    }).catch(async (err: Error) => {
      console.error({ err });
      await dispatch('auth/refreshAccessToken', undefined, { root: true });
      return null;
    });

    commit('SET_RECENTLY_PLAYED', recentlyPlayed);
  },

  async play({ state, commit }) {
    commit('SET_IS_PLAYING', true);
    await this.$spotifyApi.$put('/me/player/play', {
      position_ms: state.position,
    }).catch((err: Error) => {
      console.error({ err });
    });
  },

  async pause({ commit }) {
    commit('SET_IS_PLAYING', false);
    await this.$spotifyApi.$put('/me/player/pause')
      .catch((err: Error) => {
        console.error({ err });
      });
  },

  async seek({ state }, position) {
    // query parameters で渡す必要がある
    await this.$spotifyApi.$put('/me/player/seek', null, {
      params: {
        position_ms: position,
        device_id: state.deviceId,
      },
    }).catch((err: Error) => {
      console.error({ err });
    });
  },

  async next() {
    await this.$spotifyApi.$post('/me/player/next')
      .catch((err: Error) => {
        console.error(err);
      });
  },

  async previous() {
    await this.$spotifyApi.$post('/me/player/previous')
      .catch((err: Error) => {
        console.error(err);
      });
  },

  async shuffle({ state }) {
    await this.$spotifyApi.$put('/me/player/shuffle', null, {
      params: {
        state: !state.isShuffled,
      },
    }).catch((err: Error) => {
      console.error(err);
    });
  },

  async repeat({ state }) {
    const nextRepeatMode = (state.repeatMode + 1) % REPEAT_STATE_LIST.length as 0 | 1 | 2;
    await this.$spotifyApi.$put('/me/player/repeat', null, {
      params: {
        state: REPEAT_STATE_LIST[nextRepeatMode],
      },
    }).catch((err: Error) => {
      console.error(err);
    });
  },

  async volume({ commit }, volume) {
    await this.$spotifyApi.$put('/me/player/volume', null, {
      params: {
        volume_percent: volume,
      },
    });

    commit('SET_VOLUME', volume);
  },

  async checkSavedTracks({ commit }, trackId) {
    const [isSavedTrack] = await this.$spotifyApi.$get('/me/tracks/contains', {
      params: {
        ids: trackId,
      },
    }).catch((err: Error) => {
      console.error({ err });
    });

    commit('SET_IS_SAVED_TRACK', isSavedTrack);
  },
};

export default actions;
