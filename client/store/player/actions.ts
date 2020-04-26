import { Actions } from 'vuex';
import { PlayerState } from './state';
import { PlayerGetters } from './getters';
import { PlayerMutations } from './mutations';
import { SpotifyAPI } from '~~/types';

export type PlayerActions = {
  initPlayer: () => void
  getCurrentlyPlayingTrack: () => Promise<void>
  getActiveDeviceList: () => Promise<void>
  play: () => Promise<void>
  pause: () => Promise<void>
  seek: (position: number) => Promise<void>
};

export type RootActions = {
  'player/initPlayer': PlayerActions['initPlayer']
  'player/getActiveDeviceList': PlayerActions['getActiveDeviceList']
  'player/getCurrentlyPlayingTrack': PlayerActions['getCurrentlyPlayingTrack']
  'player/play': PlayerActions['play']
  'player/pause': PlayerActions['pause']
  'player/seek': PlayerActions['seek']
};

const actions: Actions<PlayerState, PlayerActions, PlayerGetters, PlayerMutations> = {
  initPlayer({ commit, dispatch, rootState }) {
    const token = rootState.auth.accessToken;
    if (token == null) {
      window.onSpotifyWebPlaybackSDKReady = () => {};
      return;
    }

    window.onSpotifyWebPlaybackSDKReady = async () => {
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
        'authentication_error',
        'account_error',
        'playback_error',
      ];
      errorList.forEach((errorType) => {
        player.addListener(errorType, (e) => {
          console.error(e);
        });
      });

      // Playback status updates
      player.addListener('player_state_changed', (state) => {
        const {
          position,
          duration,
          paused: isPaused,
          shuffle: isShuffled,
          repeat_mode: repeatMode,
          // @todo
          // track_window: {
          //   current_track: currentTrack,
          //   next_tracks: nextTracks,
          //   previous_tracks: previousTracks,
          // },
        } = state;

        commit('setIsPlaying', !isPaused);
        commit('setPosition', position);
        commit('setDuration', duration);
        commit('setIsShuffled', isShuffled);
        commit('setRepeatMode', repeatMode);
        console.log(state);
      });

      // Ready
      player.addListener('ready', async ({ device_id }) => {
        commit('setDeviceId', device_id);
        // デバイスをアクティブにする前に再生を止めないとアクティブにした後勝手に再生される可能性があるらしい
        await dispatch('pause');
        await this.$spotifyApi.$put('/me/player/', {
          device_ids: [device_id],
        });
        console.log('Ready with this device 🎉');
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('This device has gone offline 😴', device_id);
      });

      // @todo
      // Connect to the player
      const isConnected = await player.connect();
      console.log(isConnected);
    };

    window.onSpotifyWebPlaybackSDKReady();
  },

  async getActiveDeviceList({ commit }) {
    const { devices }: { devices: SpotifyAPI.Device[] } = await this.$spotifyApi.$get('/me/player/devices')
      .catch((err: Error) => {
        console.error(err);
        return null;
      });

    commit('setActiveDeviceList', devices);
  },

  async getCurrentlyPlayingTrack({ commit }) {
    const currentResponse = await this.$spotifyApi.get('me/player')
      .catch((e: Error) => {
        console.error(e);
        return null;
      });
    // @todo
    console.log(currentResponse);
    if (currentResponse == null || currentResponse.status !== 204) {
      commit('setCurrentlyPlaying', currentResponse?.data);
      return;
    }

    const recentlyPlayed = await this.$spotifyApi.$get('/me/player/recently-played', {
      params: {
        limit: 3,
      },
    }).catch((e: Error) => {
      console.error({ e });
      return null;
    });

    console.log(recentlyPlayed);
    commit('setRecentlyPlayed', recentlyPlayed);
  },

  async play({ state, commit }) {
    commit('setIsPlaying', true);
    await this.$spotifyApi.$put('/me/player/play', {
      position_ms: state.position,
    }).catch((e) => {
      console.error({ e });
    });
  },

  async pause({ commit }) {
    commit('setIsPlaying', false);
    await this.$spotifyApi.$put('/me/player/pause')
      .catch((err) => {
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
};

export default actions;
