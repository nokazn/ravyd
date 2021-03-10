import type { VuexGetters } from 'typed-vuex';
import type { App } from '~/entities';
import type { State } from './types';

export type Getters = {
  releaseList: App.ReleaseCard<'album'>[];
  releaseListLength: number;
  isFull: boolean;
};

const libraryReleasesGetters: VuexGetters<State, Getters> = {
  releaseList(state) {
    return state.releaseList;
  },

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
