import { Actions } from 'vuex';
import { PlayerState } from './state';
import { PlayerGetters } from './getters';
import { PlayerMutations } from './mutations';

export type PlayerActions = {
  getCurrentlyPlayingTrack: () => Promise<void>
};

export type RootActions = {
  'player/getCurrentlyPlayingTrack': PlayerActions['getCurrentlyPlayingTrack']
};

const actions: Actions<PlayerState, PlayerActions, PlayerGetters, PlayerMutations> = {
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
};

export default actions;
