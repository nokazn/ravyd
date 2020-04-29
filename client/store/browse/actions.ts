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
    { commit, rootState },
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

    commit('SET_NEW_RELEASES', newReleases);
  },
};

export default actions;
