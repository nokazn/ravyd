import type { VuexGetters } from 'typed-vuex';
import type { State } from './types';

export type Getters = {
  releaseListLength: number;
  isFull: boolean;
};

const libraryReleasesGetters: VuexGetters<State, Getters> = {
  releaseListLength(state) {
    return state.releaseList?.length ?? 0;
  },

  isFull(state, getters) {
    return state.total != null
      ? getters.releaseListLength >= state.total
      : false;
  },
};

export default libraryReleasesGetters;
