import type { VuexGetters } from 'typed-vuex';
import type { State } from './types';

export type Getters = {
  artistListLength: number
  isFull: boolean
  lastArtistId: string | undefined
};

const libraryArtistsGetters: VuexGetters<State, Getters> = {
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
