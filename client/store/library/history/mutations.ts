/* eslint-disable no-param-reassign */
import { Mutations } from 'typed-vuex';
import { LibraryHistoryState } from './state';
import { SpotifyAPI } from '~~/types';

export type LibraryHistoryMutations = {
  SET_RECENTLY_PLAYED: SpotifyAPI.Player.RecentlyPlayed | undefined
}

export type RootMutations = {
  'library/history/SET_RECENTLY_PLAYED': LibraryHistoryMutations['SET_RECENTLY_PLAYED']
}

const mutations: Mutations<LibraryHistoryState, LibraryHistoryMutations> = {
  SET_RECENTLY_PLAYED(state, recentlyPlayed) {
    state.recentlyPlayed = recentlyPlayed;
  },
};

export default mutations;
