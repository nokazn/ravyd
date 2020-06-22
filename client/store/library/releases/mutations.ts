/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { LibraryReleasesState } from './state';
import { App } from '~~/types';

export type LibraryReleasesMutations = {
  SET_RELEASE_LIST: App.ReleaseCardInfo[] | null
  ADD_TO_RELEASE_LIST: App.ReleaseCardInfo[] | null
  UNSHIFT_TO_RELEASE_LIST: App.ReleaseCardInfo[] | null
  SET_IS_FULL_RELEASE_LIST: boolean
  INCREMENT_NUMBER_OF_UNUPDATED_RELEASES: void
  RESET_NUMBER_OF_UNUPDATED_RELEASES: void
  SET_ACTUAL_IS_SAVED: [string, boolean],
  DELETE_ACTUAL_IS_SAVED: string,
};

export type RootMutations = {
  'library/releases/SET_RELEASE_LIST': LibraryReleasesMutations['SET_RELEASE_LIST'];
  'library/releases/ADD_TO_RELEASE_LIST': LibraryReleasesMutations['ADD_TO_RELEASE_LIST'];
  'library/releases/UNSHIFT_TO_RELEASE_LIST': LibraryReleasesMutations['UNSHIFT_TO_RELEASE_LIST'];
  'library/releases/SET_IS_FULL_RELEASE_LIST': LibraryReleasesMutations['SET_IS_FULL_RELEASE_LIST'];
  'library/releases/INCREMENT_NUMBER_OF_UNUPDATED_RELEASES': LibraryReleasesMutations['INCREMENT_NUMBER_OF_UNUPDATED_RELEASES'];
  'library/releases/RESET_NUMBER_OF_UNUPDATED_RELEASES': LibraryReleasesMutations['RESET_NUMBER_OF_UNUPDATED_RELEASES'];
  'library/releases/SET_ACTUAL_IS_SAVED': LibraryReleasesMutations['SET_ACTUAL_IS_SAVED'];
  'library/releases/DELETE_ACTUAL_IS_SAVED': LibraryReleasesMutations['DELETE_ACTUAL_IS_SAVED'];
};

const mutations: Mutations<LibraryReleasesState, LibraryReleasesMutations> = {
  SET_RELEASE_LIST(state, releaseList) {
    state.releaseList = releaseList;
  },

  ADD_TO_RELEASE_LIST(state, releaseList) {
    const currentReleaseList = state.releaseList;
    if (releaseList != null) {
      state.releaseList = currentReleaseList != null
        ? [...currentReleaseList, ...releaseList]
        : releaseList;
    }
  },

  UNSHIFT_TO_RELEASE_LIST(state, releaseList) {
    const currentReleaseList = state.releaseList;
    if (releaseList != null) {
      state.releaseList = currentReleaseList != null
        ? [...releaseList, ...currentReleaseList]
        : releaseList;
    }
  },

  SET_IS_FULL_RELEASE_LIST(state, isFullReleaseList) {
    state.isFullReleaseList = isFullReleaseList;
  },

  INCREMENT_NUMBER_OF_UNUPDATED_RELEASES(state) {
    const currentNumberOfUnupdatedReleases = state.numberOfUnupdatedReleases;
    state.numberOfUnupdatedReleases = currentNumberOfUnupdatedReleases + 1;
  },

  RESET_NUMBER_OF_UNUPDATED_RELEASES(state) {
    state.numberOfUnupdatedReleases = 0;
  },

  SET_ACTUAL_IS_SAVED(state, [key, isSaved]) {
    state.actualIsSavedMap.set(key, isSaved);
  },

  DELETE_ACTUAL_IS_SAVED(state, key) {
    state.actualIsSavedMap.delete(key);
  },
};

export default mutations;
