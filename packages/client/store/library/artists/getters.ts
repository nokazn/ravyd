import type { Getters } from 'typed-vuex';
import type { LibraryArtistsState } from './state';

export type LibraryArtistsGetters = {
  artistListLength: number
  isFull: boolean
  lastArtistId: string | undefined
};

export type RootGetters = {
  'library/artists/artistListLength': LibraryArtistsGetters['artistListLength']
  'library/artists/isFull': LibraryArtistsGetters['isFull']
  'library/artists/lastArtistId': LibraryArtistsGetters['lastArtistId']
};

const libraryArtistsGetters: Getters<LibraryArtistsState, LibraryArtistsGetters> = {
  artistListLength(state) {
    return state.artistList?.length ?? 0;
  },

  isFull(state, getters) {
    return state.total != null
      ? getters.artistListLength >= state.total
      : false;
  },

  lastArtistId(state) {
    const { artistList } = state;
    const { length } = artistList;
    return length !== 0
      ? artistList[length - 1].id
      : undefined;
  },
};

export default libraryArtistsGetters;
