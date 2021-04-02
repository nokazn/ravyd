import type { VuexGetters } from 'typed-vuex';
import type { App } from '~/entities';
import type { State } from './types';

export type Getters = {
  trackList: App.PlaylistTrackDetail[];
  trackListLength: number;
  isFull: boolean;
};

const libraryTracksGetters: VuexGetters<State, Getters> = {
  trackList(state) {
    return state.trackList;
  },

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
