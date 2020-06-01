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
};

export type RootMutations = {
  'library/releases/SET_RELEASE_LIST': LibraryReleasesMutations['SET_RELEASE_LIST'];
  'library/releases/ADD_TO_RELEASE_LIST': LibraryReleasesMutations['ADD_TO_RELEASE_LIST'];
  'library/releases/UNSHIFT_TO_RELEASE_LIST': LibraryReleasesMutations['UNSHIFT_TO_RELEASE_LIST'];
  'library/releases/SET_IS_FULL_TRACK_LIST': LibraryReleasesMutations['SET_IS_FULL_RELEASE_LIST'];
  'library/releases/INCREMENT_NUMBER_OF_UNUPDATED_TRACKS': LibraryReleasesMutations['INCREMENT_NUMBER_OF_UNUPDATED_RELEASES'];
  'library/releases/RESET_NUMBER_OF_UNUPDATED_TRACKS': LibraryReleasesMutations['RESET_NUMBER_OF_UNUPDATED_RELEASES'];
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
    const currentNumberOfUnupdatedTracks = state.numberOfUnupdatedReleases;
    state.numberOfUnupdatedReleases = currentNumberOfUnupdatedTracks + 1;
  },

  RESET_NUMBER_OF_UNUPDATED_RELEASES(state) {
    state.numberOfUnupdatedReleases = 0;
  },
};

export default mutations;
