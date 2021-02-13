import type { Getters } from 'typed-vuex';
import type { LibraryShowsState } from './state';

export type LibraryShowsGetters = {
  showListLength: number
  isFull: boolean
}

export type RootGetters = {
  'library/shows/showListLength': LibraryShowsGetters['showListLength']
  'library/shows/isFull': LibraryShowsGetters['isFull']
}

const libraryShowsGetters: Getters<LibraryShowsState, LibraryShowsGetters> = {
  showListLength(state) {
    return state.showList?.length ?? 0;
  },

  isFull(state, getters) {
    return state.total != null
      ? getters.showListLength >= state.total
      : false;
  },

};

export default libraryShowsGetters;
