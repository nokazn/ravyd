import { Getters } from 'vuex';
import { LibraryState } from './state';

export type LibraryGetters = {
  trackListOffset: number
};

export type RootGetters = {
  'library/trackListOffset': LibraryGetters['trackListOffset']
};

const getters: Getters<LibraryState, LibraryGetters> = {
  trackListOffset(state) {
    const { trackList } = state;
    return trackList != null
      ? trackList.length + 1
      : 0;
  },
};

export default getters;
