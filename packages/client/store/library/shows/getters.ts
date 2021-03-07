import type { VuexGetters } from 'typed-vuex';
import type { State } from './types';

export type Getters = {
  showListLength: number
  isFull: boolean
}

const libraryShowsGetters: VuexGetters<State, Getters> = {
  showListLength(state) {
    return state.showList?.length ?? 0;
  },

  isFull(state, getters) {
    return state.total != null
      ? getters.showListLength >= state.total
      : false;
  },

};

export default libraryShowsGetters;
