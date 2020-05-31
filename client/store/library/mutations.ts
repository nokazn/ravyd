/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { LibraryState } from './state';
import { App } from '~~/types';

export type LibraryMutations = {
  SET_TRACK_LIST: App.PlaylistTrackDetail[] | null
  SET_IS_FULL_TRACK_LIST: boolean
};

export type RootMutations = {
  'library/SET_TRACK_LIST': LibraryMutations['SET_TRACK_LIST'];
  'library/SET_IS_FULL_TRACK_LIST': LibraryMutations['SET_IS_FULL_TRACK_LIST'];
};

const mutations: Mutations<LibraryState, LibraryMutations> = {
  SET_TRACK_LIST(state, trackList) {
    const currentTrackList = state.trackList;
    if (trackList != null) {
      state.trackList = currentTrackList != null
        ? [...currentTrackList, ...trackList]
        : trackList;
    } else {
      state.trackList = null;
    }
  },

  SET_IS_FULL_TRACK_LIST(state, isFullTrackList) {
    state.isFullTrackList = isFullTrackList;
  },
};

export default mutations;
