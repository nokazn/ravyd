/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { PlayerState } from './state';
import type { SpotifyAPI } from '~~/types';

export type PlayerMutations = {
  setDeviceId: string
  setActiveDeviceList: SpotifyAPI.Device[]
  setCurrentTrack: Spotify.Track
  setNextTrackList: Spotify.Track[]
  setPreviousTrackList: Spotify.Track[]
  setRecentlyPlayed: SpotifyAPI.Player.RecentlyPlayed | null
  setIsPlaying: boolean
  setPosition: number
  setDuration: number
  setIsShuffled: boolean
  setRepeatMode: 0 | 1 | 2
  setDisallowList: string[]
  setVolume: number
};

export type RootMutations = {
  ['player/setDeviceId']: PlayerMutations['setDeviceId']
  ['player/setActiveDeviceList']: PlayerMutations['setActiveDeviceList']
  ['player/setCurrentTrack']: PlayerMutations['setCurrentTrack']
  ['player/setNextTrackList']: PlayerMutations['setNextTrackList']
  ['player/setPreviousTrackList']: PlayerMutations['setPreviousTrackList']
  ['player/setRecentlyPlayed']: PlayerMutations['setRecentlyPlayed']
  ['player/setIsPlaying']: PlayerMutations['setIsPlaying']
  ['player/setPosition']: PlayerMutations['setPosition']
  ['player/setDuration']: PlayerMutations['setDuration']
  ['player/setIsShuffled']: PlayerMutations['setIsShuffled']
  ['player/setRepeatMode']: PlayerMutations['setRepeatMode']
  ['player/setDisallowList']: PlayerMutations['setDisallowList']
  ['player/setVolume']: PlayerMutations['setVolume']
};

const mutations: Mutations<PlayerState, PlayerMutations> = {
  setDeviceId(state, deviceId) {
    state.deviceId = deviceId;
  },

  setActiveDeviceList(state, deviceList) {
    state.activeDeviceList = deviceList;
  },

  setCurrentTrack(state, currentTrack) {
    state.artWorkSrc = currentTrack.album.images[0].url;
    state.trackName = currentTrack.name;
    state.trackId = currentTrack.id;
    state.artistList = currentTrack.artists.map((artist) => ({
      name: artist.name,
      id: artist.uri.replace(/^.+:/g, ''),
    }));
  },

  setNextTrackList(state, nextTrackList) {
    state.nextTrackList = nextTrackList;
  },

  setPreviousTrackList(state, previousTrackList) {
    state.previousTrackList = previousTrackList;
  },

  setRecentlyPlayed(state, recentLyPlayed) {
    state.recentlyPlayed = recentLyPlayed;
  },

  setIsPlaying(state, isPlaying) {
    state.isPlaying = isPlaying;
  },

  setPosition(state, position) {
    state.position = position;
  },

  setDuration(state, duration) {
    state.duration = duration;
  },

  setIsShuffled(state, isShuffled) {
    state.isShuffled = isShuffled;
  },

  setRepeatMode(state, repeatMode) {
    state.repeatMode = repeatMode;
  },

  setDisallowList(state, disallowList) {
    state.disallowList = disallowList;
  },

  setVolume(state, volume) {
    state.volume = volume;
  },
};

export default mutations;
