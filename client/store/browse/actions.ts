import { Actions } from 'vuex';
import { BrowseState } from './state';
import { BrowseGetters } from './getters';
import { BrowseMutations } from './mutations';
import { SpotifyAPI } from '~~/types';

export type BrowseActions = {
  getNewReleases: (limit?: number) => Promise<void>
}

export type RootActions = {
  'browse/getNewReleases': BrowseActions['getNewReleases']
}

const actions: Actions<BrowseState, BrowseActions, BrowseGetters, BrowseMutations> = {
  async getNewReleases(
    { commit, dispatch, rootState },
    limit = 10,
  ): Promise<void> {
    if (rootState.auth.accessToken == null) return;

    const { albums: newReleases } : {
      albums: SpotifyAPI.Browse.NewReleases | null
    } = await this.$spotifyApi.$get('/browse/new-releases', {
      params: {
        limit,
      },
    }).catch((e) => {
      console.error(e);
      return null;
    });
    commit('setNewReleases', newReleases);

    dispatch('auth/refreshAccessToken', undefined, { root: true });
  },
};

export default actions;
