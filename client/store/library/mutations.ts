/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { LibraryState } from './state';
import { App } from '~~/types';

export type LibraryMutations = {
  SET_TRACK_LIST: App.PlaylistTrackDetail[] | null
};

export type RootMutations = {
  'library/SET_TRACK_LIST': LibraryMutations['SET_TRACK_LIST'];
};

const mutations: Mutations<LibraryState, LibraryMutations> = {
  SET_TRACK_LIST(state, trackList) {
    state.trackList = trackList;
  },
};

export default mutations;
