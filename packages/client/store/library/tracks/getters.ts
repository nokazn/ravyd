import type { Getters } from 'typed-vuex';
import type { LibraryTracksState } from './state';

export type LibraryTracksGetters = {
  trackListLength: number
  isFull: boolean
};

export type RootGetters = {
  'library/tracks/trackListLength': LibraryTracksGetters['trackListLength']
  'library/tracks/isFull': LibraryTracksGetters['isFull']
};

const libraryTracksGetters: Getters<LibraryTracksState, LibraryTracksGetters> = {
  trackListLength(state) {
    return state.trackList?.length ?? 0;
  },

  isFull(state, getters) {
    return state.total != null
      ? getters.trackListLength >= state.total
      : false;
  },
};

export default libraryTracksGetters;
