import { Getters } from 'vuex';
import { LibraryReleasesState } from './state';

export type LibraryReleasesGetters = {
  releaseListLength: number
};

export type RootGetters = {
  'library/releases/releaseListLength': LibraryReleasesGetters['releaseListLength']
};

const getters: Getters<LibraryReleasesState, LibraryReleasesGetters> = {
  releaseListLength(state) {
    const { releaseList } = state;
    return releaseList != null
      ? releaseList.length
      : 0;
  },
};

export default getters;
