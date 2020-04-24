/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { PlayerState } from './state';
import type { SpotifyAPI } from '@/types';

export type PlayerMutations = {
  setDeviceId: string
  setCurrentlyPlaying: SpotifyAPI.Player.CurrentlyPlaying | null
  setRecentlyPlayed: SpotifyAPI.Player.RecentlyPlayed | null
};

export type RootMutations = {
  ['player/setDeviceId']: PlayerMutations['setDeviceId']
  ['player/setCurrentlyPlaying']: PlayerMutations['setCurrentlyPlaying']
  ['player/setRecentlyPlayed']: PlayerMutations['setRecentlyPlayed']
};

const mutations: Mutations<PlayerState, PlayerMutations> = {
  setDeviceId(state, deviceId) {
    state.deviceId = deviceId ?? null;
  },
  setCurrentlyPlaying(state, playing) {
    state.currentlyPlaying = playing ?? null;
  },

  setRecentlyPlayed(state, played) {
    state.recentlyPlayed = played ?? null;
  },
};

export default mutations;
