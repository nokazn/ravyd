/* eslint-disable no-param-reassign */
import { Mutations } from 'typed-vuex';
import { LibraryShowsState } from './state';
import { App } from '~~/types';

export type LibraryShowsMutations = {
  SET_SHOW_LIST: App.ShowCardInfo[]
  ADD_TO_SHOW_LIST: App.ShowCardInfo[]
  UNSHIFT_TO_SHOW_LIST: App.ShowCardInfo[]
  SET_TOTAL: number
  INCREMENT_UNUPDATED_COUNTS: void
  RESET_UNUPDATED_COUNTS: void
  SET_ACTUAL_IS_SAVED: [string, boolean],
  DELETE_ACTUAL_IS_SAVED: string,
}

export type RootMutations = {
  'library/shows/SET_SHOW_LIST': LibraryShowsMutations['SET_SHOW_LIST']
  'library/shows/ADD_TO_SHOW_LIST': LibraryShowsMutations['ADD_TO_SHOW_LIST']
  'library/shows/UNSHIFT_TO_SHOW_LIST': LibraryShowsMutations['UNSHIFT_TO_SHOW_LIST']
  'library/shows/SET_TOTAL': LibraryShowsMutations['SET_TOTAL']
  'library/shows/INCREMENT_UNUPDATED_COUNTS': LibraryShowsMutations['INCREMENT_UNUPDATED_COUNTS']
  'library/shows/RESET_UNUPDATED_COUNTS': LibraryShowsMutations['RESET_UNUPDATED_COUNTS']
  'library/shows/SET_ACTUAL_IS_SAVED': LibraryShowsMutations['SET_ACTUAL_IS_SAVED']
  'library/shows/DELETE_ACTUAL_IS_SAVED': LibraryShowsMutations['DELETE_ACTUAL_IS_SAVED']
}

const mutations: Mutations<LibraryShowsState, LibraryShowsMutations> = {
  SET_SHOW_LIST(state, showList) {
    state.showList = showList;
  },

  ADD_TO_SHOW_LIST(state, showList) {
    const currentShowList = state.showList;
    state.showList = [...currentShowList, ...showList];
  },

  UNSHIFT_TO_SHOW_LIST(state, showList) {
    const currentShowList = state.showList;
    state.showList = [...showList, ...currentShowList];
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
