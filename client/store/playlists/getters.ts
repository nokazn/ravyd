import { Getters } from 'typed-vuex';

import type { SpotifyAPI } from 'shared/types';
import { PlaylistsState } from './state';

export type PlaylistsGetters = {
  ownPlaylists: SpotifyAPI.SimplePlaylist[]
  playlistCounts: number
}

export type RootGetters = {
  'playlists/ownPlaylists': PlaylistsGetters['ownPlaylists']
  'playlists/playlistCounts': PlaylistsGetters['playlistCounts']
}

const getters: Getters<PlaylistsState, PlaylistsGetters> = {
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
