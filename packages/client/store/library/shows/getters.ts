import type { VuexGetters } from 'typed-vuex';
import type { SpotifyAPI } from 'shared/types';
import type { State } from './types';

export type Getters = {
  showList: SpotifyAPI.SimpleShow[];
  showListLength: number;
  isFull: boolean;
};

const libraryShowsGetters: VuexGetters<State, Getters> = {
  showList(state) {
    return state.showList;
  },

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
