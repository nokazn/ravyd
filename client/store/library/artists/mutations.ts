/* eslint-disable no-param-reassign */
import { Mutations } from 'typed-vuex';
import { LibraryArtistsState } from './state';
import { App } from '~~/types';

export type LibraryArtistsMutations = {
  SET_ARTIST_LIST: App.ArtistCardInfo[]
  ADD_TO_ARTIST_LIST: App.ArtistCardInfo[]
  UNSHIFT_TO_ARTIST_LIST: App.ArtistCardInfo[]
  SET_TOTAL: number
  INCREMENT_NUMBER_OF_UNUPDATED_ARTISTS: void
  RESET_NUMBER_OF_UNUPDATED_ARTISTS: void
  SET_ACTUAL_IS_SAVED: [string, boolean],
  DELETE_ACTUAL_IS_SAVED: string,
};

export type RootMutations = {
  'library/artists/SET_ARTIST_LIST': LibraryArtistsMutations['SET_ARTIST_LIST'];
  'library/artists/ADD_TO_ARTIST_LIST': LibraryArtistsMutations['ADD_TO_ARTIST_LIST'];
  'library/artists/UNSHIFT_TO_ARTIST_LIST': LibraryArtistsMutations['UNSHIFT_TO_ARTIST_LIST'];
  'library/artists/SET_TOTAL': LibraryArtistsMutations['SET_TOTAL'];
  'library/artists/INCREMENT_NUMBER_OF_UNUPDATED_ARTISTS': LibraryArtistsMutations['INCREMENT_NUMBER_OF_UNUPDATED_ARTISTS'];
  'library/artists/RESET_NUMBER_OF_UNUPDATED_ARTISTS': LibraryArtistsMutations['RESET_NUMBER_OF_UNUPDATED_ARTISTS'];
  'library/artists/SET_ACTUAL_IS_SAVED': LibraryArtistsMutations['SET_ACTUAL_IS_SAVED'];
  'library/artists/DELETE_ACTUAL_IS_SAVED': LibraryArtistsMutations['DELETE_ACTUAL_IS_SAVED'];
};

const mutations: Mutations<LibraryArtistsState, LibraryArtistsMutations> = {
  SET_ARTIST_LIST(state, artistList) {
    state.artistList = artistList;
  },

  ADD_TO_ARTIST_LIST(state, artistList) {
    const currentArtistList = state.artistList;
    if (artistList != null) {
      state.artistList = currentArtistList != null
        ? [...currentArtistList, ...artistList]
        : artistList;
    }
  },

  UNSHIFT_TO_ARTIST_LIST(state, artistList) {
    const currentArtistList = state.artistList;
    if (artistList != null) {
      state.artistList = currentArtistList != null
        ? [...artistList, ...currentArtistList]
        : artistList;
    }
  },

  SET_TOTAL(state, total) {
    state.total = total;
  },

  INCREMENT_NUMBER_OF_UNUPDATED_ARTISTS(state) {
    const currentNumberOfUnupdatedArtists = state.numberOfUnupdatedArtist;
    state.numberOfUnupdatedArtist = currentNumberOfUnupdatedArtists + 1;
  },

  RESET_NUMBER_OF_UNUPDATED_ARTISTS(state) {
    state.numberOfUnupdatedArtist = 0;
  },

  SET_ACTUAL_IS_SAVED(state, [key, isSaved]) {
    state.actualIsSavedMap.set(key, isSaved);
  },

  DELETE_ACTUAL_IS_SAVED(state, key) {
    state.actualIsSavedMap.delete(key);
  },
};

export default mutations;
