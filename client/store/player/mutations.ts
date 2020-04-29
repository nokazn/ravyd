/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { PlayerState } from './state';
import type { SpotifyAPI } from '~~/types';

export type PlayerMutations = {
  SET_DEVICE_ID: string
  SET_ACTIVE_DEVICE_LIST: SpotifyAPI.Device[]
  SET_CURRENT_TRACK: Spotify.Track
  SET_NEXT_TRACK_LIST: Spotify.Track[]
  SET_PREVIOUS_TRACK_LIST: Spotify.Track[]
  SET_RECENTLY_PLAYED: SpotifyAPI.Player.RecentlyPlayed | null
  SET_IS_SAVED_TRACK: boolean
  SET_IS_PLAYING: boolean
  SET_POSITION: number
  SET_DURATION: number
  SET_IS_SHUFFLED: boolean
  SET_REPEAT_MODE: 0 | 1 | 2
  SET_DISALLOW_LIST: string[]
  SET_VOLUME: number
};

export type RootMutations = {
  ['player/SET_DEVICE_ID']: PlayerMutations['SET_DEVICE_ID']
  ['player/SET_ACTIVE_DEVICE_LIST']: PlayerMutations['SET_ACTIVE_DEVICE_LIST']
  ['player/SET_CURRENT_TRACK']: PlayerMutations['SET_CURRENT_TRACK']
  ['player/SET_NEXT_TRACK_LIST']: PlayerMutations['SET_NEXT_TRACK_LIST']
  ['player/SET_PREVIOUS_TRACK_LIST']: PlayerMutations['SET_PREVIOUS_TRACK_LIST']
  ['player/SET_RECENTLY_PLAYED']: PlayerMutations['SET_RECENTLY_PLAYED']
  ['player/SET_IS_SAVED_TRACK']: PlayerMutations['SET_IS_SAVED_TRACK']
  ['player/SET_IS_PLAYING']: PlayerMutations['SET_IS_PLAYING']
  ['player/SET_POSITION']: PlayerMutations['SET_POSITION']
  ['player/SET_DURATION']: PlayerMutations['SET_DURATION']
  ['player/SET_IS_SHUFFLED']: PlayerMutations['SET_IS_SHUFFLED']
  ['player/SET_REPEAT_MODE']: PlayerMutations['SET_REPEAT_MODE']
  ['player/SET_DISALLOW_LIST']: PlayerMutations['SET_DISALLOW_LIST']
  ['player/SET_VOLUME']: PlayerMutations['SET_VOLUME']
};

const mutations: Mutations<PlayerState, PlayerMutations> = {
  SET_DEVICE_ID(state, deviceId) {
    state.deviceId = deviceId;
  },

  SET_ACTIVE_DEVICE_LIST(state, deviceList) {
    state.activeDeviceList = deviceList;
  },

  SET_CURRENT_TRACK(state, currentTrack) {
    state.artWorkSrc = currentTrack.album.images[0].url;
    state.trackName = currentTrack.name;
    state.trackId = currentTrack.id;
    state.artistList = currentTrack.artists.map((artist) => ({
      name: artist.name,
      id: artist.uri.replace(/^.+:/g, ''),
    }));
  },

  SET_NEXT_TRACK_LIST(state, nextTrackList) {
    state.nextTrackList = nextTrackList;
  },

  SET_PREVIOUS_TRACK_LIST(state, previousTrackList) {
    state.previousTrackList = previousTrackList;
  },

  SET_RECENTLY_PLAYED(state, recentLyPlayed) {
    state.recentlyPlayed = recentLyPlayed;
  },

  SET_IS_SAVED_TRACK(state, isSavedTrack) {
    state.isSavedTrack = isSavedTrack;
  },

  SET_IS_PLAYING(state, isPlaying) {
    state.isPlaying = isPlaying;
  },

  SET_POSITION(state, position) {
    state.position = position;
  },

  SET_DURATION(state, duration) {
    state.duration = duration;
  },

  SET_IS_SHUFFLED(state, isShuffled) {
    state.isShuffled = isShuffled;
  },

  SET_REPEAT_MODE(state, repeatMode) {
    state.repeatMode = repeatMode;
  },

  SET_DISALLOW_LIST(state, disallowList) {
    state.disallowList = disallowList;
  },

  SET_VOLUME(state, volume) {
    state.volume = volume;
  },
};

export default mutations;
