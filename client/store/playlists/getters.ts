import { Getters } from 'vuex';

import { PlaylistsState } from './state';
import { SpotifyAPI } from '~~/types';

export type PlaylistsGetters = {
  ownPlaylists: SpotifyAPI.SimplePlaylist[]
}

export type RootGetters = {
  'playlists/ownPlaylists': PlaylistsGetters['ownPlaylists']
}

const getters: Getters<PlaylistsState, PlaylistsGetters> = {
  ownPlaylists(state, _g, _s, RootGetters) {
    const userId = RootGetters['auth/userId'];

    return state.playlists
      ?.filter((playlist) => playlist.owner.id === userId || playlist.collaborative) ?? [];
  },
};

export default getters;
