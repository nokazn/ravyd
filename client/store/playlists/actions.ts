import { Actions } from 'vuex';
import { PlaylistsState } from './state';
import { PlaylistsGetters } from './getters';
import { PlaylistsMutations } from './mutations';

export type PlaylistsActions = {
  getPlaylists: (payload?: { offset?: number, limit?: number }) => Promise<void>
}

export type RootActions = {
  'playlists/getPlaylists': PlaylistsActions['getPlaylists']
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
};

export default actions;
