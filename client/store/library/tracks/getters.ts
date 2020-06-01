import { Getters } from 'vuex';
import { LibraryState } from './state';

export type LibraryGetters = {
  trackListLength: number
};

export type RootGetters = {
  'library/tracks/trackListLength': LibraryGetters['trackListLength']
};

const getters: Getters<LibraryState, LibraryGetters> = {
  trackListLength(state) {
    const { trackList } = state;
    return trackList != null
      ? trackList.length
      : 0;
  },
};

export default getters;
