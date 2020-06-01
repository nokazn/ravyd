import { Getters } from 'vuex';
import { LibraryTracksState } from './state';

export type LibraryTracksGetters = {
  trackListLength: number
};

export type RootGetters = {
  'library/tracks/trackListLength': LibraryTracksGetters['trackListLength']
};

const getters: Getters<LibraryTracksState, LibraryTracksGetters> = {
  trackListLength(state) {
    const { trackList } = state;
    return trackList != null
      ? trackList.length
      : 0;
  },
};

export default getters;
