import { Actions } from 'vuex';
import { BrowseState } from './state';
import { BrowseGetters } from './getters';
import { BrowseMutations } from './mutations';

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

    const res = await this.$axios({
      url: 'https://api.spotify.com/v1/browse/new-releases',
      headers: {
        Authorization: `Bearer ${rootState.auth.accessToken}`,
      },
      params: {
        limit,
      },
    }).catch((e) => {
      console.error(e);
      return null;
    });
    console.log(res?.data, { res });
    commit('setNewReleases', res?.data);

    dispatch('auth/refreshAccessToken', undefined, { root: true });
  },
};

export default actions;
