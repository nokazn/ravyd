/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { LibraryState } from './state';
import { App } from '~~/types';

export type LibraryMutations = {
  SET_TRACK_LIST: App.PlaylistTrackDetail[] | null
  ADD_TO_TRACK_LIST: App.PlaylistTrackDetail[] | null
  UNSHIFT_TO_TRACK_LIST: App.PlaylistTrackDetail[] | null
  SET_IS_FULL_TRACK_LIST: boolean
  INCREMENT_NUMBER_OF_UNUPDATED_TRACKS: void
  RESET_NUMBER_OF_UNUPDATED_TRACKS: void
};

export type RootMutations = {
  'library/tracks/SET_TRACK_LIST': LibraryMutations['SET_TRACK_LIST'];
  'library/tracks/ADD_TO_TRACK_LIST': LibraryMutations['ADD_TO_TRACK_LIST'];
  'library/tracks/UNSHIFT_TO_TRACK_LIST': LibraryMutations['UNSHIFT_TO_TRACK_LIST'];
  'library/tracks/SET_IS_FULL_TRACK_LIST': LibraryMutations['SET_IS_FULL_TRACK_LIST'];
  'library/tracks/INCREMENT_NUMBER_OF_UNUPDATED_TRACKS': LibraryMutations['INCREMENT_NUMBER_OF_UNUPDATED_TRACKS'];
  'library/tracks/RESET_NUMBER_OF_UNUPDATED_TRACKS': LibraryMutations['RESET_NUMBER_OF_UNUPDATED_TRACKS'];
};

const mutations: Mutations<LibraryState, LibraryMutations> = {
  SET_TRACK_LIST(state, trackList) {
    state.trackList = trackList;
  },

  ADD_TO_TRACK_LIST(state, trackList) {
    const currentTrackList = state.trackList;
    if (trackList != null) {
      state.trackList = currentTrackList != null
        ? [...currentTrackList, ...trackList]
        : trackList;
    }
  },

  UNSHIFT_TO_TRACK_LIST(state, trackList) {
    const currentTrackList = state.trackList;
    if (trackList != null) {
      state.trackList = currentTrackList != null
        ? [...trackList, ...currentTrackList]
        : trackList;
    }
  },

  SET_IS_FULL_TRACK_LIST(state, isFullTrackList) {
    state.isFullTrackList = isFullTrackList;
  },

  INCREMENT_NUMBER_OF_UNUPDATED_TRACKS(state) {
    const currentNumberOfUnupdatedTracks = state.numberOfUnupdatedTracks;
    state.numberOfUnupdatedTracks = currentNumberOfUnupdatedTracks + 1;
  },

  RESET_NUMBER_OF_UNUPDATED_TRACKS(state) {
    state.numberOfUnupdatedTracks = 0;
  },
};

export default mutations;
