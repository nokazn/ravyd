/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { PlaylistsState } from './state';
import { SpotifyAPI } from '~~/types';

export type PlaylistsMutations = {
  SET_PLAYLISTS: SpotifyAPI.SimplePlaylist[] | undefined
  ADD_PLAYLIST: SpotifyAPI.SimplePlaylist
}

export type RootMutations = {
  'playlists/SET_PLAYLISTS': PlaylistsMutations['SET_PLAYLISTS']
  'playlists/ADD_PLAYLIST': PlaylistsMutations['ADD_PLAYLIST']
}

const mutations: Mutations<PlaylistsState, PlaylistsMutations> = {
  SET_PLAYLISTS(state, playlists) {
    state.playlists = playlists;
  },

  ADD_PLAYLIST(state, playlist) {
    const { playlists } = state;
    state.playlists = playlists != null
      ? [playlist, ...playlists]
      : [playlist];
  },
};

export default mutations;
