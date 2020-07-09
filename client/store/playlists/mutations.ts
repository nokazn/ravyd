/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { PlaylistsState } from './state';
import { SpotifyAPI } from '~~/types';

export type PlaylistsMutations = {
  SET_PLAYLISTS: SpotifyAPI.SimplePlaylist[] | undefined
  ADD_PLAYLIST: SpotifyAPI.SimplePlaylist
  EDIT_PLAYLIST: {
    index: number
    id: string
    name?: string
    description?: string
    isPublic?: boolean
    isCollaborative?: boolean
  }
  REMOVE_PLAYLIST: string
  SET_ACTUAL_IS_SAVED: [string, boolean],
  DELETE_ACTUAL_IS_SAVED: string,
}

export type RootMutations = {
  'playlists/SET_PLAYLISTS': PlaylistsMutations['SET_PLAYLISTS']
  'playlists/ADD_PLAYLIST': PlaylistsMutations['ADD_PLAYLIST']
  'playlists/EDIT_PLAYLIST': PlaylistsMutations['EDIT_PLAYLIST']
  'playlists/REMOVE_PLAYLIST': PlaylistsMutations['REMOVE_PLAYLIST']
  'playlists/SET_ACTUAL_IS_SAVED': PlaylistsMutations['SET_ACTUAL_IS_SAVED']
  'playlists/DELETE_ACTUAL_IS_SAVED': PlaylistsMutations['DELETE_ACTUAL_IS_SAVED']
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

  EDIT_PLAYLIST(state, {
    index, name, description, isPublic, isCollaborative,
  }) {
    const { playlists } = state;
    if (playlists == null) return;

    const modifiedPlaylists = [...playlists];
    const playlist = modifiedPlaylists[index];
    modifiedPlaylists[index] = {
      ...playlist,
      name: name ?? playlist.name,
      // 空文字列の場合は null にする
      description: (description ?? playlist.description) || null,
      public: isPublic ?? playlist.public,
      collaborative: isCollaborative ?? playlist.collaborative,
    };
    state.playlists = modifiedPlaylists;
  },

  REMOVE_PLAYLIST(state, playlistId) {
    const { playlists } = state;
    if (playlists == null) return;

    const modifiedPlaylists = [...playlists];
    const index = modifiedPlaylists.findIndex((playlist) => playlist.id === playlistId);
    if (index === -1) return;

    modifiedPlaylists.splice(index, 1);
    state.playlists = modifiedPlaylists;
  },

  SET_ACTUAL_IS_SAVED(state, [key, isSaved]) {
    state.actualIsSavedMap.set(key, isSaved);
  },

  DELETE_ACTUAL_IS_SAVED(state, key) {
    state.actualIsSavedMap.delete(key);
  },
};

export default mutations;
