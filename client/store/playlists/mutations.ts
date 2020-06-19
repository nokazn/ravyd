/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { PlaylistsState } from './state';
import { SpotifyAPI } from '~~/types';

export type PlaylistsMutations = {
  SET_PLAYLISTS: SpotifyAPI.SimplePlaylist[] | undefined
}

export type RootMutations = {
  'playlists/SET_PLAYLISTS': PlaylistsMutations['SET_PLAYLISTS']
}

const mutations: Mutations<PlaylistsState, PlaylistsMutations> = {
  SET_PLAYLISTS(state, playlists) {
    state.playlists = playlists;
  },
};

export default mutations;
