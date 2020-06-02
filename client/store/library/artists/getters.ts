import { Getters } from 'vuex';
import { LibraryArtistsState } from './state';

export type LibraryArtistsGetters = {
  artistListLength: number
  lastArtistId: string | undefined
};

export type RootGetters = {
  'library/artists/artistListLength': LibraryArtistsGetters['artistListLength']
  'library/artists/lastArtistId': LibraryArtistsGetters['lastArtistId']
};

const getters: Getters<LibraryArtistsState, LibraryArtistsGetters> = {
  artistListLength(state) {
    const { artistList } = state;
    return artistList != null
      ? artistList.length
      : 0;
  },

  lastArtistId(state) {
    const { artistList } = state;
    return artistList != null
      ? artistList[artistList.length - 1]?.id
      : undefined;
  },
};

export default getters;
