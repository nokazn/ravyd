/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { PlayerState } from './state';
import type { SpotifyAPI } from '~~/types';

export type PlayerMutations = {
  setDeviceId: string
  setActiveDeviceList: SpotifyAPI.Device[]
  setCurrentlyPlaying: SpotifyAPI.Player.CurrentlyPlaying | null
  setRecentlyPlayed: SpotifyAPI.Player.RecentlyPlayed | null
  changePlayState: undefined
  setVolume: number
};

export type RootMutations = {
  ['player/setDeviceId']: PlayerMutations['setDeviceId']
  ['player/setActiveDeviceList']: PlayerMutations['setActiveDeviceList']
  ['player/setCurrentlyPlaying']: PlayerMutations['setCurrentlyPlaying']
  ['player/setRecentlyPlayed']: PlayerMutations['setRecentlyPlayed']
  ['player/changePlayState']: PlayerMutations['changePlayState']
  ['player/setVolume']: PlayerMutations['setVolume']
};

const mutations: Mutations<PlayerState, PlayerMutations> = {
  setDeviceId(state, deviceId) {
    state.deviceId = deviceId;
  },

  setActiveDeviceList(state, deviceList) {
    state.activeDeviceList = deviceList;
  },

  setCurrentlyPlaying(state, playing) {
    state.currentlyPlaying = playing;
  },

  setRecentlyPlayed(state, recentLyPlayed) {
    state.recentlyPlayed = recentLyPlayed;
  },

  changePlayState(state) {
    state.isPlaying = !state.isPlaying;
  },

  setVolume(state, volume) {
    state.volume = volume;
  },
};

export default mutations;
