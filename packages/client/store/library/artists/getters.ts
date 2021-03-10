import type { VuexGetters } from 'typed-vuex';
import type { SpotifyAPI } from 'shared/types';
import type { State } from './types';

export type Getters = {
  artistList: SpotifyAPI.Artist[];
  artistListLength: number;
  isFull: boolean;
  lastArtistId: string | undefined;
};

const libraryArtistsGetters: VuexGetters<State, Getters> = {
  artistList(state) {
    return state.artistList;
  },

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
