/* eslint-disable no-param-reassign */
import type { VuexMutations } from 'typed-vuex';

import type { SpotifyAPI } from 'shared/types';
import type { App } from '~/entities';
import type { State } from './types';

export type Mutations = {
  SET_RECENTLY_PLAYED: SpotifyAPI.Player.History[];
  ADD_TO_RECENTLY_PLAYED: SpotifyAPI.Player.History[];
  UNSHIFT_TO_RECENTLY_PLAYED: SpotifyAPI.Player.History[];
  SET_TRACK_HISTORY_LIST: App.PlaylistTrackDetail[];
  SET_TOTAL: number;
};

const mutations: VuexMutations<State, Mutations> = {
  SET_RECENTLY_PLAYED(state, recentlyPlayed) {
    state.recentlyPlayed = recentlyPlayed;
  },

  ADD_TO_RECENTLY_PLAYED(state, recentlyPlayed) {
    const currentRecentlyPlayed = state.recentlyPlayed;
    state.recentlyPlayed = [...currentRecentlyPlayed, ...recentlyPlayed];
  },

  UNSHIFT_TO_RECENTLY_PLAYED(state, recentlyPlayed) {
    const currentRecentlyPlayed = state.recentlyPlayed;
    state.recentlyPlayed = [...recentlyPlayed, ...currentRecentlyPlayed];
  },

  SET_TRACK_HISTORY_LIST(state, historyList) {
    state.historyList = historyList;
  },

  SET_TOTAL(state, total) {
    state.total = total;
  },
};

export default mutations;
