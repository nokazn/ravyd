import type { Getters } from 'typed-vuex';
import type { LibraryReleasesState } from './state';

export type LibraryReleasesGetters = {
  releaseListLength: number;
  isFull: boolean;
};

export type RootGetters = {
  'library/releases/releaseListLength': LibraryReleasesGetters['releaseListLength']
  'library/releases/isFull': LibraryReleasesGetters['isFull']
};

const libraryReleasesGetters: Getters<LibraryReleasesState, LibraryReleasesGetters> = {
  releaseListLength(state) {
    return state.releaseList?.length ?? 0;
  },

  isFull(state, getters) {
    return state.total != null
      ? getters.releaseListLength >= state.total
      : false;
  },
};

export default libraryReleasesGetters;
