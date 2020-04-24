import { Actions } from 'vuex';
import { PlayerState } from './state';
import { PlayerGetters } from './getters';
import { PlayerMutations } from './mutations';

export type PlayerActions = {
  initPlayer: () => void
  getCurrentlyPlayingTrack: () => Promise<void>
  play: () => Promise<void>
  pause: () => Promise<void>
};

export type RootActions = {
  'player/initPlayer': PlayerActions['initPlayer']
  'player/getCurrentlyPlayingTrack': PlayerActions['getCurrentlyPlayingTrack']
  'player/play': PlayerActions['play']
  'player/pause': PlayerActions['pause']
};

const actions: Actions<PlayerState, PlayerActions, PlayerGetters, PlayerMutations> = {
  initPlayer({ rootState }) {
    const token = rootState.auth.accessToken;
    console.log(token);
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
        console.log(state);
      });

      // Ready
      player.addListener('ready', (context) => {
        console.log('Ready with Device ID 🎉', context);
      });

      // Not Ready
      player.addListener('not_ready', (context) => {
        console.log('Device ID has gone offline 😴', context);
      });

      // @todo
      // Connect to the player
      const isConnected = await player.connect();
      console.log(isConnected);
    };

    window.onSpotifyWebPlaybackSDKReady();
  },

  async getCurrentlyPlayingTrack({ commit, rootState }) {
    // @todo
    // await dispatch('auth/refreshAccessToken', undefined, { root: true });

    const currentRes = await this.$axios({
      method: 'GET',
      url: 'https://api.spotify.com/v1/me/player',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${rootState.auth.accessToken}`,
      },
    }).catch((e: Error) => {
      console.error(e);
      return null;
    });
    // @todo
    console.log(currentRes);
    if (currentRes == null || currentRes.status !== 204) {
      commit('setCurrentlyPlaying', currentRes?.data);
      return;
    }

    const recentlyRes = await this.$axios({
      method: 'GET',
      url: 'https://api.spotify.com/v1/me/player/recently-played',
      params: {
        limit: 3,
      },
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${rootState.auth.accessToken}`,
      },
    }).catch((e: Error) => {
      console.error({ e });
      return null;
    });
    console.log(recentlyRes);
    commit('setRecentlyPlayed', recentlyRes?.data);
  },

  async play({ rootState }) {
    await this.$axios({
      method: 'PUT',
      url: 'https://api.spotify.com/v1/me/player/play',
      headers: {
        Authorization: `Bearer ${rootState.auth.accessToken}`,
      },
    }).catch((e) => {
      console.error({ e });
    });
  },
  async pause({ rootState }) {
    await this.$axios({
      method: 'PUT',
      url: 'https://api.spotify.com/v1/me/player/pause',
      headers: {
        Authorization: `Bearer ${rootState.auth.accessToken}`,
      },
    }).catch((e) => {
      console.error({ e });
    });
  },
};

export default actions;
