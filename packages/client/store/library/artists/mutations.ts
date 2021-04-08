/* eslint-disable no-param-reassign */
import type { VuexMutations } from 'typed-vuex';
import type { SpotifyAPI } from 'shared/types';
import type { State } from './types';

export type Mutations = {
  SET_ARTIST_LIST: SpotifyAPI.Artist[];
  ADD_TO_ARTIST_LIST: SpotifyAPI.Artist[];
  UNSHIFT_TO_ARTIST_LIST: SpotifyAPI.Artist[];
  SET_TOTAL: number;
  INCREMENT_UNACQUIRED_ARTISTS: void;
  RESET_UNACQUIRED_ARTISTS: void;
  SET_ACTUAL_IS_SAVED: [string, boolean];
  DELETE_ACTUAL_IS_SAVED: string;
};

const mutations: VuexMutations<State, Mutations> = {
  SET_ARTIST_LIST(state, artistList) {
    state.artistList = artistList;
  },

  ADD_TO_ARTIST_LIST(state, artistList) {
    const currentArtistList = state.artistList;
    state.artistList = [...currentArtistList, ...artistList];
  },

  UNSHIFT_TO_ARTIST_LIST(state, artistList) {
    const currentArtistList = state.artistList;
    state.artistList = [...artistList, ...currentArtistList];
  },

  SET_TOTAL(state, total) {
    state.total = total;
  },

  INCREMENT_UNACQUIRED_ARTISTS(state) {
    state.unacquiredArtists += 1;
  },

  RESET_UNACQUIRED_ARTISTS(state) {
    state.unacquiredArtists = 0;
  },

  SET_ACTUAL_IS_SAVED(state, [key, isSaved]) {
    state.actualIsSavedMap.set(key, isSaved);
  },

  DELETE_ACTUAL_IS_SAVED(state, key) {
    state.actualIsSavedMap.delete(key);
  },
};

export default mutations;
