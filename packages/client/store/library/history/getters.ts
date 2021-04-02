import type { VuexGetters } from 'typed-vuex';
import type { App } from '~/entities';
import type { State } from './types';

export type Getters = {
  historyList: App.PlaylistTrackDetail[];
  historyLength: number;
  hasNext: boolean;
};

const libraryHistoryGetters: VuexGetters<State, Getters> = {
  historyList(state) {
    return state.historyList;
  },

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
