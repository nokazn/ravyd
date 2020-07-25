/* eslint-disable no-param-reassign */
import { Mutations } from 'typed-vuex';
import { LibraryReleasesState } from './state';
import { App } from '~~/types';

export type LibraryReleasesMutations = {
  SET_RELEASE_LIST: App.ReleaseCardInfo[]
  ADD_TO_RELEASE_LIST: App.ReleaseCardInfo[]
  UNSHIFT_TO_RELEASE_LIST: App.ReleaseCardInfo[]
  SET_TOTAL: number
  INCREMENT_UNUPDATED_COUNTS: void
  RESET_UNUPDATED_COUNTS: void
  SET_ACTUAL_IS_SAVED: [string, boolean],
  DELETE_ACTUAL_IS_SAVED: string,
};

export type RootMutations = {
  'library/releases/SET_RELEASE_LIST': LibraryReleasesMutations['SET_RELEASE_LIST'];
  'library/releases/ADD_TO_RELEASE_LIST': LibraryReleasesMutations['ADD_TO_RELEASE_LIST'];
  'library/releases/UNSHIFT_TO_RELEASE_LIST': LibraryReleasesMutations['UNSHIFT_TO_RELEASE_LIST'];
  'library/releases/SET_TOTAL': LibraryReleasesMutations['SET_TOTAL'];
  'library/releases/INCREMENT_UNUPDATED_COUNTS': LibraryReleasesMutations['INCREMENT_UNUPDATED_COUNTS'];
  'library/releases/RESET_UNUPDATED_COUNTS': LibraryReleasesMutations['RESET_UNUPDATED_COUNTS'];
  'library/releases/SET_ACTUAL_IS_SAVED': LibraryReleasesMutations['SET_ACTUAL_IS_SAVED'];
  'library/releases/DELETE_ACTUAL_IS_SAVED': LibraryReleasesMutations['DELETE_ACTUAL_IS_SAVED'];
};

const mutations: Mutations<LibraryReleasesState, LibraryReleasesMutations> = {
  SET_RELEASE_LIST(state, releaseList) {
    state.releaseList = releaseList;
  },

  ADD_TO_RELEASE_LIST(state, releaseList) {
    const currentReleaseList = state.releaseList;
    state.releaseList = currentReleaseList != null
      ? [...currentReleaseList, ...releaseList]
      : releaseList;
  },

  UNSHIFT_TO_RELEASE_LIST(state, releaseList) {
    const currentReleaseList = state.releaseList;
    state.releaseList = currentReleaseList != null
      ? [...releaseList, ...currentReleaseList]
      : releaseList;
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
