/* eslint-disable no-param-reassign */
import type { VuexMutations } from 'typed-vuex';

import type { App } from '~/entities';
import type { State } from './types';

export type Mutations = {
  SET_RELEASE_LIST: App.ReleaseCard<'album'>[];
  ADD_TO_RELEASE_LIST: App.ReleaseCard<'album'>[];
  UNSHIFT_TO_RELEASE_LIST: App.ReleaseCard<'album'>[];
  SET_TOTAL: number;
  INCREMENT_UNUPDATED_COUNTS: void;
  RESET_UNUPDATED_COUNTS: void;
  SET_ACTUAL_IS_SAVED: [string, boolean];
  DELETE_ACTUAL_IS_SAVED: string;
};

const mutations: VuexMutations<State, Mutations> = {
  SET_RELEASE_LIST(state, releaseList) {
    state.releaseList = releaseList;
  },

  ADD_TO_RELEASE_LIST(state, releaseList) {
    const currentReleaseList = state.releaseList;
    state.releaseList = [...currentReleaseList, ...releaseList];
  },

  UNSHIFT_TO_RELEASE_LIST(state, releaseList) {
    const currentReleaseList = state.releaseList;
    state.releaseList = [...releaseList, ...currentReleaseList];
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
