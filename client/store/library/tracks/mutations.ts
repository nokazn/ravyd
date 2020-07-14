/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { LibraryTracksState } from './state';
import { App } from '~~/types';

export type LibraryTracksMutations = {
  SET_TRACK_LIST: App.PlaylistTrackDetail[] | null
  SET_TOTAL: number
  ADD_TO_TRACK_LIST: App.PlaylistTrackDetail[] | null
  UNSHIFT_TO_TRACK_LIST: App.PlaylistTrackDetail[] | null
  INCREMENT_NUMBER_OF_UNUPDATED_TRACKS: void
  RESET_NUMBER_OF_UNUPDATED_TRACKS: void
  SET_ACTUAL_IS_SAVED: [string, boolean],
  DELETE_ACTUAL_IS_SAVED: string,
};

export type RootMutations = {
  'library/tracks/SET_TRACK_LIST': LibraryTracksMutations['SET_TRACK_LIST'];
  'library/tracks/SET_TOTAL': LibraryTracksMutations['SET_TOTAL'];
  'library/tracks/ADD_TO_TRACK_LIST': LibraryTracksMutations['ADD_TO_TRACK_LIST'];
  'library/tracks/UNSHIFT_TO_TRACK_LIST': LibraryTracksMutations['UNSHIFT_TO_TRACK_LIST'];
  'library/tracks/INCREMENT_NUMBER_OF_UNUPDATED_TRACKS': LibraryTracksMutations['INCREMENT_NUMBER_OF_UNUPDATED_TRACKS'];
  'library/tracks/RESET_NUMBER_OF_UNUPDATED_TRACKS': LibraryTracksMutations['RESET_NUMBER_OF_UNUPDATED_TRACKS'];
  'library/tracks/SET_ACTUAL_IS_SAVED': LibraryTracksMutations['SET_ACTUAL_IS_SAVED'];
  'library/tracks/DELETE_ACTUAL_IS_SAVED': LibraryTracksMutations['DELETE_ACTUAL_IS_SAVED'];
};

const mutations: Mutations<LibraryTracksState, LibraryTracksMutations> = {
  SET_TRACK_LIST(state, trackList) {
    state.trackList = trackList;
  },

  SET_TOTAL(state, total) {
    state.total = total;
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

  INCREMENT_NUMBER_OF_UNUPDATED_TRACKS(state) {
    const currentNumberOfUnupdatedTracks = state.numberOfUnupdatedTracks;
    state.numberOfUnupdatedTracks = currentNumberOfUnupdatedTracks + 1;
  },

  RESET_NUMBER_OF_UNUPDATED_TRACKS(state) {
    state.numberOfUnupdatedTracks = 0;
  },

  SET_ACTUAL_IS_SAVED(state, [key, isSaved]) {
    state.actualIsSavedMap.set(key, isSaved);
  },

  DELETE_ACTUAL_IS_SAVED(state, key) {
    state.actualIsSavedMap.delete(key);
  },
};

export default mutations;
