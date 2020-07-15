import { Getters } from 'vuex';
import { LibraryTracksState } from './state';

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
    return getters.trackListLength >= state.total;
  },
};

export default libraryTracksGetters;
