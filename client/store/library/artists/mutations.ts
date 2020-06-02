/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { LibraryArtistsState } from './state';
import { App } from '~~/types';

export type LibraryArtistsMutations = {
  SET_ARTIST_LIST: App.ArtistCardInfo[] | null
  ADD_TO_ARTIST_LIST: App.ArtistCardInfo[] | null
  UNSHIFT_TO_ARTIST_LIST: App.ArtistCardInfo[] | null
  SET_IS_FULL_ARTIST_LIST: boolean
  INCREMENT_NUMBER_OF_UNUPDATED_ARTISTS: void
  RESET_NUMBER_OF_UNUPDATED_ARTISTS: void
};

export type RootMutations = {
  'library/artists/SET_ARTIST_LIST': LibraryArtistsMutations['SET_ARTIST_LIST'];
  'library/artists/ADD_TO_ARTIST_LIST': LibraryArtistsMutations['ADD_TO_ARTIST_LIST'];
  'library/artists/UNSHIFT_TO_ARTIST_LIST': LibraryArtistsMutations['UNSHIFT_TO_ARTIST_LIST'];
  'library/artists/SET_IS_FULL_ARTIST_LIST': LibraryArtistsMutations['SET_IS_FULL_ARTIST_LIST'];
  'library/artists/INCREMENT_NUMBER_OF_UNUPDATED_ARTISTS': LibraryArtistsMutations['INCREMENT_NUMBER_OF_UNUPDATED_ARTISTS'];
  'library/artists/RESET_NUMBER_OF_UNUPDATED_ARTISTS': LibraryArtistsMutations['RESET_NUMBER_OF_UNUPDATED_ARTISTS'];
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

  SET_IS_FULL_ARTIST_LIST(state, isFullArtistList) {
    state.isFullArtistList = isFullArtistList;
  },

  INCREMENT_NUMBER_OF_UNUPDATED_ARTISTS(state) {
    const currentNumberOfUnupdatedArtists = state.numberOfUnupdatedArtist;
    state.numberOfUnupdatedArtist = currentNumberOfUnupdatedArtists + 1;
  },

  RESET_NUMBER_OF_UNUPDATED_ARTISTS(state) {
    state.numberOfUnupdatedArtist = 0;
  },
};

export default mutations;
