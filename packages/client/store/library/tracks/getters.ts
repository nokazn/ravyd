import type { VuexGetters } from 'typed-vuex';
import type { State } from './types';

export type Getters = {
  trackListLength: number
  isFull: boolean
};

const libraryTracksGetters: VuexGetters<State, Getters> = {
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
