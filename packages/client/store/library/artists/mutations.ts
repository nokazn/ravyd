/* eslint-disable no-param-reassign */
import type { Mutations } from 'typed-vuex';
import type { SpotifyAPI } from 'shared/types';
import type { LibraryArtistsState } from './state';

export type LibraryArtistsMutations = {
  SET_ARTIST_LIST: SpotifyAPI.Artist[]
  ADD_TO_ARTIST_LIST: SpotifyAPI.Artist[]
  UNSHIFT_TO_ARTIST_LIST: SpotifyAPI.Artist[]
  SET_TOTAL: number
  INCREMENT_UNUPDATED_COUNTS: void
  RESET_UNUPDATED_COUNTS: void
  SET_ACTUAL_IS_SAVED: [string, boolean],
  DELETE_ACTUAL_IS_SAVED: string,
};

export type RootMutations = {
  'library/artists/SET_ARTIST_LIST': LibraryArtistsMutations['SET_ARTIST_LIST'];
  'library/artists/ADD_TO_ARTIST_LIST': LibraryArtistsMutations['ADD_TO_ARTIST_LIST'];
  'library/artists/UNSHIFT_TO_ARTIST_LIST': LibraryArtistsMutations['UNSHIFT_TO_ARTIST_LIST'];
  'library/artists/SET_TOTAL': LibraryArtistsMutations['SET_TOTAL'];
  'library/artists/INCREMENT_UNUPDATED_COUNTS': LibraryArtistsMutations['INCREMENT_UNUPDATED_COUNTS'];
  'library/artists/RESET_UNUPDATED_COUNTS': LibraryArtistsMutations['RESET_UNUPDATED_COUNTS'];
  'library/artists/SET_ACTUAL_IS_SAVED': LibraryArtistsMutations['SET_ACTUAL_IS_SAVED'];
  'library/artists/DELETE_ACTUAL_IS_SAVED': LibraryArtistsMutations['DELETE_ACTUAL_IS_SAVED'];
};

const mutations: Mutations<LibraryArtistsState, LibraryArtistsMutations> = {
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

  INCREMENT_UNUPDATED_COUNTS(state) {
    state.unupdatedCounts += 1;
  },

  RESET_UNUPDATED_COUNTS(state) {
    state.unupdatedCounts = 0;
  },

  SET_ACTUAL_IS_SAVED(state, [key, isSaved]) {
    state.actualIsSavedMap.set(key, isSaved);
  },

  DELETE_ACTUAL_IS_SAVED(state, key) {
    state.actualIsSavedMap.delete(key);
  },
};

export default mutations;