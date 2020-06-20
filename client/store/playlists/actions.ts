import { Actions } from 'vuex';
import { PlaylistsState } from './state';
import { PlaylistsGetters } from './getters';
import { PlaylistsMutations } from './mutations';

export type PlaylistsActions = {
  getPlaylists: (payload?: { offset?: number, limit?: number }) => Promise<void>
  getAllPlaylists: () => Promise<void>
}

export type RootActions = {
  'playlists/getPlaylists': PlaylistsActions['getPlaylists']
  'playlists/getAllPlaylists': PlaylistsActions['getAllPlaylists']
}

const actions: Actions<PlaylistsState, PlaylistsActions, PlaylistsGetters, PlaylistsMutations> = {
  async getPlaylists({ commit }, payload) {
    const limit = payload?.limit ?? 50;
    const offset = payload?.offset;
    const playlists = await this.$spotify.playlists.getListOfCurrentUserPlaylist({
      limit,
      offset,
    });

    commit('SET_PLAYLISTS', playlists?.items);
  },

  async getAllPlaylists({ commit }) {
    const limit = 50;
    const firstListOfPlaylists = await this.$spotify.playlists.getListOfCurrentUserPlaylist({
      limit,
    });

    if (firstListOfPlaylists == null) {
      commit('SET_PLAYLISTS', firstListOfPlaylists);
      return;
    }

    const handler = async (index: number) => {
      const playlists = await this.$spotify.playlists.getListOfCurrentUserPlaylist({
        offset: limit * (index + 1),
        limit,
      });
      if (playlists == null) return [];

      return playlists.items;
    };
    const unacquiredCounts = firstListOfPlaylists.total - limit;
    const handlerCounts = Math.ceil(unacquiredCounts / limit);

    const listOfPlaylists = await Promise.all(new Array(handlerCounts)
      .fill(undefined)
      .map((_, index) => handler(index)))
      .then((listsOfPlaylists) => listsOfPlaylists.flat());

    commit('SET_PLAYLISTS', [
      ...firstListOfPlaylists.items,
      ...listOfPlaylists,
    ]);
  },
};

export default actions;
