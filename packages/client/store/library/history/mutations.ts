/* eslint-disable no-param-reassign */
import type { VuexMutations } from 'typed-vuex';

import type { SpotifyAPI } from 'shared/types';
import type { App } from '~/entities';
import type { State } from './types';

export type Mutations = {
  SET_RECENTLY_PLAYED: SpotifyAPI.Player.History[];
  SET_TRACK_HISTORY_LIST: App.PlaylistTrackDetail[];
};

const mutations: VuexMutations<State, Mutations> = {
  SET_RECENTLY_PLAYED(state, recentlyPlayed) {
    state.recentlyPlayed = recentlyPlayed;
  },

  SET_TRACK_HISTORY_LIST(state, historyList) {
    state.historyList = historyList;
  },
};

export default mutations;
