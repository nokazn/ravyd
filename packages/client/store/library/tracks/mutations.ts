/* eslint-disable no-param-reassign */
import type { VuexMutations } from 'typed-vuex';

import type { App } from '~/entities';
import type { State } from './types';

export type Mutations = {
  SET_TRACK_LIST: App.PlaylistTrackDetail[];
  ADD_TO_TRACK_LIST: App.PlaylistTrackDetail[];
  UNSHIFT_TO_TRACK_LIST: App.PlaylistTrackDetail[];
  SET_TOTAL: number;
  INCREMENT_MISSING_OUT_TRACKS: void;
  RESET_MISSING_OUT_TRACKS: void;
  SET_ACTUAL_IS_SAVED: [string, boolean];
  DELETE_ACTUAL_IS_SAVED: string;
};

const mutations: VuexMutations<State, Mutations> = {
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

  INCREMENT_MISSING_OUT_TRACKS(state) {
    state.missingOutTracks += 1;
  },

  RESET_MISSING_OUT_TRACKS(state) {
    state.missingOutTracks = 0;
  },

  SET_ACTUAL_IS_SAVED(state, [key, isSaved]) {
    state.actualIsSavedMap.set(key, isSaved);
  },

  DELETE_ACTUAL_IS_SAVED(state, key) {
    state.actualIsSavedMap.delete(key);
  },
};

export default mutations;
