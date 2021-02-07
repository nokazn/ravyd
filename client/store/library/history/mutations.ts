/* eslint-disable no-param-reassign */
import { Mutations } from 'typed-vuex';
import type { SpotifyAPI } from 'shared/types';
import type { App } from '~/entities';
import type { LibraryHistoryState } from './state';


export type LibraryHistoryMutations = {
  SET_RECENTLY_PLAYED: SpotifyAPI.Player.History[]
  ADD_TO_RECENTLY_PLAYED: SpotifyAPI.Player.History[]
  UNSHIFT_TO_RECENTLY_PLAYED: SpotifyAPI.Player.History[]
  SET_TRACK_HISTORY_LIST: App.PlaylistTrackDetail[]
  SET_TOTAL: number
}

export type RootMutations = {
  'library/history/SET_RECENTLY_PLAYED': LibraryHistoryMutations['SET_RECENTLY_PLAYED']
  'library/history/ADD_TO_RECENTLY_PLAYED': LibraryHistoryMutations['ADD_TO_RECENTLY_PLAYED']
  'library/history/UNSHIFT_TO_RECENTLY_PLAYED': LibraryHistoryMutations['UNSHIFT_TO_RECENTLY_PLAYED']
  'library/history/SET_TRACK_HISTORY_LIST': LibraryHistoryMutations['SET_TRACK_HISTORY_LIST']
  'library/history/SET_TOTAL': LibraryHistoryMutations['SET_TOTAL']
}

const mutations: Mutations<LibraryHistoryState, LibraryHistoryMutations> = {
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

  SET_TRACK_HISTORY_LIST(state, trackHistoryList) {
    state.trackHistoryList = trackHistoryList;
  },

  SET_TOTAL(state, total) {
    state.total = total;
  },
};

export default mutations;
