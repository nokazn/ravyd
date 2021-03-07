import type { VuexGetters } from 'typed-vuex';
import type { State } from './types';

export type Getters = {
  historyLength: number
  hasNext: boolean
}

const libraryHistoryGetters: VuexGetters<State, Getters> = {
  historyLength(state) {
    return state.recentlyPlayed?.length ?? 0;
  },

  hasNext(state, getters) {
    return state.total != null
      ? getters.historyLength >= state.total
      : false;
  },
};

export default libraryHistoryGetters;
