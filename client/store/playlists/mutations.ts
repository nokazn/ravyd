/* eslint-disable no-param-reassign */
import { Mutations } from 'typed-vuex';
import { PlaylistsState } from './state';
import { SpotifyAPI } from '~~/types';

export type PlaylistsMutations = {
  SET_PLAYLISTS: SpotifyAPI.SimplePlaylist[] | undefined
  ADD_PLAYLIST: SpotifyAPI.SimplePlaylist
  EDIT_PLAYLIST: {
    id: string
    name?: string
    description?: string
    isPublic?: boolean
    isCollaborative?: boolean
  }
  REMOVE_PLAYLIST: string
  MODIFY_PLAYLIST_TOTAL_TRACKS: {
    playlistId: string
    total: number
  }
  SET_ACTUAL_IS_SAVED: [string, boolean],
  DELETE_ACTUAL_IS_SAVED: string,
  INCREMENT_UNUPDATED_TRACKS_MAP: [string, number],
  DELETE_UNUPDATED_TRACKS_MAP: string,
  SET_ACTUALLY_DELETED_TRACK: [string, {
    uri: string
    positions: [number]
  }],
  DELETE_ACTUALLY_DELETED_TRACK: string,
}

export type RootMutations = {
  'playlists/SET_PLAYLISTS': PlaylistsMutations['SET_PLAYLISTS']
  'playlists/ADD_PLAYLIST': PlaylistsMutations['ADD_PLAYLIST']
  'playlists/EDIT_PLAYLIST': PlaylistsMutations['EDIT_PLAYLIST']
  'playlists/REMOVE_PLAYLIST': PlaylistsMutations['REMOVE_PLAYLIST']
  'playlists/MODIFY_PLAYLIST_TOTAL_TRACKS': PlaylistsMutations['MODIFY_PLAYLIST_TOTAL_TRACKS']
  'playlists/SET_ACTUAL_IS_SAVED': PlaylistsMutations['SET_ACTUAL_IS_SAVED']
  'playlists/DELETE_ACTUAL_IS_SAVED': PlaylistsMutations['DELETE_ACTUAL_IS_SAVED']
  'playlists/INCREMENT_UNUPDATED_TRACKS_MAP': PlaylistsMutations['INCREMENT_UNUPDATED_TRACKS_MAP']
  'playlists/DELETE_UNUPDATED_TRACKS_MAP': PlaylistsMutations['DELETE_UNUPDATED_TRACKS_MAP']
  'playlists/SET_ACTUALLY_DELETED_TRACK': PlaylistsMutations['SET_ACTUALLY_DELETED_TRACK']
  'playlists/DELETE_ACTUALLY_DELETED_TRACK': PlaylistsMutations['DELETE_ACTUALLY_DELETED_TRACK']
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
    id, name, description, isPublic, isCollaborative,
  }) {
    const { playlists } = state;
    if (playlists == null) return;

    const modifiedPlaylists = [...playlists];
    const index = modifiedPlaylists.findIndex((playlist) => playlist.id === id);
    // 削除 (実際はアンフォロー) したプレイリストを編集した時
    if (index === -1) return;

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

  MODIFY_PLAYLIST_TOTAL_TRACKS(state, { playlistId, total }) {
    const { playlists } = state;
    if (playlists == null) return;

    const modifiedPlaylists = [...playlists];
    const index = modifiedPlaylists.findIndex((playlist) => playlist.id === playlistId);
    if (index === -1) return;

    const playlist = modifiedPlaylists[index];
    modifiedPlaylists[index] = {
      ...playlist,
      tracks: {
        ...playlist.tracks,
        total,
      },
    };

    state.playlists = modifiedPlaylists;
  },

  SET_ACTUAL_IS_SAVED(state, [key, isSaved]) {
    state.actualIsSavedMap.set(key, isSaved);
  },

  DELETE_ACTUAL_IS_SAVED(state, key) {
    state.actualIsSavedMap.delete(key);
  },

  INCREMENT_UNUPDATED_TRACKS_MAP(state, [key, isTrackSavedMap]) {
    state.unupdatedTrackCountsMap.set(key, isTrackSavedMap);
  },

  DELETE_UNUPDATED_TRACKS_MAP(state, key) {
    state.unupdatedTrackCountsMap.delete(key);
  },

  SET_ACTUALLY_DELETED_TRACK(state, [key, track]) {
    state.actuallyDeletedTrackMap.set(key, track);
  },

  DELETE_ACTUALLY_DELETED_TRACK(state, key) {
    state.actuallyDeletedTrackMap.delete(key);
  },
};

export default mutations;
