/* eslint-disable no-param-reassign */
import { Mutations } from 'typed-vuex';
import type { App } from '~/entities';
import { LibraryTracksState } from './state';

export type LibraryTracksMutations = {
  SET_TRACK_LIST: App.PlaylistTrackDetail[]
  ADD_TO_TRACK_LIST: App.PlaylistTrackDetail[]
  UNSHIFT_TO_TRACK_LIST: App.PlaylistTrackDetail[]
  SET_TOTAL: number
  INCREMENT_UNUPDATED_COUNTS: void
  RESET_UNUPDATED_COUNTS: void
  SET_ACTUAL_IS_SAVED: [string, boolean],
  DELETE_ACTUAL_IS_SAVED: string,
};

export type RootMutations = {
  'library/tracks/SET_TRACK_LIST': LibraryTracksMutations['SET_TRACK_LIST'];
  'library/tracks/SET_TOTAL': LibraryTracksMutations['SET_TOTAL'];
  'library/tracks/ADD_TO_TRACK_LIST': LibraryTracksMutations['ADD_TO_TRACK_LIST'];
  'library/tracks/UNSHIFT_TO_TRACK_LIST': LibraryTracksMutations['UNSHIFT_TO_TRACK_LIST'];
  'library/tracks/INCREMENT_UNUPDATED_COUNTS': LibraryTracksMutations['INCREMENT_UNUPDATED_COUNTS'];
  'library/tracks/RESET_UNUPDATED_COUNTS': LibraryTracksMutations['RESET_UNUPDATED_COUNTS'];
  'library/tracks/SET_ACTUAL_IS_SAVED': LibraryTracksMutations['SET_ACTUAL_IS_SAVED'];
  'library/tracks/DELETE_ACTUAL_IS_SAVED': LibraryTracksMutations['DELETE_ACTUAL_IS_SAVED'];
};

const mutations: Mutations<LibraryTracksState, LibraryTracksMutations> = {
  SET_TRACK_LIST(state, trackList) {
    state.trackList = trackList;
  },

  ADD_TO_TRACK_LIST(state, trackList) {
    const currentTrackList = state.trackList;
    state.trackList = [...currentTrackList, ...trackList];
  },

  UNSHIFT_TO_TRACK_LIST(state, trackList) {
    const currentTrackList = state.trackList;
    state.trackList = [...trackList, ...currentTrackList];
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
