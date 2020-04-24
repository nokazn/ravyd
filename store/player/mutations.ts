/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { PlayerState } from './state';
import type { SpotifyAPI } from '@/types';

export type PlayerMutations = {
  setCurrentlyPlaying: SpotifyAPI.Player.CurrentlyPlaying | null
  setRecentlyPlayed: SpotifyAPI.Player.RecentlyPlayed | null
};

export type RootMutations = {
  ['player/setCurrentlyPlaying']: PlayerMutations['setCurrentlyPlaying']
};

const mutations: Mutations<PlayerState, PlayerMutations> = {
  setCurrentlyPlaying(state, playing) {
    state.currentlyPlaying = playing ?? null;
  },

  setRecentlyPlayed(state, played) {
    state.recentlyPlayed = played ?? null;
  },
};

export default mutations;
