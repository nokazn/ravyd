import type { VuexGetters } from 'typed-vuex';
import type { App } from '~/entities';
import type { State } from './types';

export type Getters = {
  historyList: App.PlaylistTrackDetail[];
};

const libraryHistoryGetters: VuexGetters<State, Getters> = {
  historyList(state) {
    return state.historyList;
  },
};

export default libraryHistoryGetters;
