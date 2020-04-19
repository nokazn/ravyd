/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { PlayerState } from './state';
import type { Spotify } from '@/types';

export type PlayerMutations = {
  setCurrentlyPlaying: Spotify.Player.CurrentlyPlaying | null
  setRecentlyPlayed: Spotify.Player.RecentlyPlayed | null
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
