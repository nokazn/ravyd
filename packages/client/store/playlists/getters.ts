import type { VuexGetters } from 'typed-vuex';
import type { SpotifyAPI } from 'shared/types';
import type { State } from './types';

export type Getters = {
  ownPlaylists: SpotifyAPI.SimplePlaylist[]
  playlistCounts: number
}

const getters: VuexGetters<State, Getters> = {
  ownPlaylists(state, _g, _s, rootGetters) {
    const userId = rootGetters['auth/userId'];

    return state.playlists
      ?.filter((playlist) => playlist.owner.id === userId || playlist.collaborative) ?? [];
  },

  playlistCounts(state) {
    return state.playlists?.length ?? 0;
  },
};

export default getters;
