/* eslint-disable no-param-reassign */
import { Mutations } from 'typed-vuex';
import { PlaybackState } from './state';
import { DEFAULT_DURATION_MS } from '~/constants';
import { convertUriToId } from '~/scripts/converter/convertUriToId';
import type { SpotifyAPI, ZeroToHundred } from '~~/types';

// @todo
type ExtendedTrack = Spotify.Track & {
  linked_from?: SpotifyAPI.LinkedTrack
}

export type PlaybackMutations = {
  SET_GET_CURRENT_PLAYBACK_TIMER_ID: ReturnType<typeof setTimeout> | number | undefined
  SET_DEVICE_ID: string | undefined
  SET_ACTIVE_DEVICE_ID: string | undefined
  SET_DEVICE_LIST: SpotifyAPI.Device[]
  SET_CUSTOM_CONTEXT_URI: string | undefined
  SET_CUSTOM_TRACK_URI_LIST: string[] | undefined
  SET_TRACK_INDEX: number | undefined
  SET_RECENTLY_PLAYED: SpotifyAPI.Player.RecentlyPlayed | undefined
  SET_CURRENT_TRACK: ExtendedTrack | undefined
  SET_NEXT_TRACK_LIST: ExtendedTrack[]
  SET_PREVIOUS_TRACK_LIST: ExtendedTrack[]
  SET_IS_SAVED_TRACK: boolean
  SET_IS_PLAYING: boolean
  SET_CONTEXT_URI: string | undefined
  SET_POSITION_MS: number
  SET_DURATION_MS: number | undefined
  SET_DISABLED_PLAYING_FROM_BEGINING: boolean
  SET_IS_SHUFFLED: boolean
  SET_REPEAT_MODE: 0 | 1 | 2
  SET_DISALLOWS: SpotifyAPI.Disallows
  SET_VOLUME_PERCENT: { volumePercent: ZeroToHundred }
  SET_IS_MUTED: boolean
};

export type RootMutations = {
  'playback/SET_GET_CURRENT_PLAYBACK_TIMER_ID': PlaybackMutations['SET_GET_CURRENT_PLAYBACK_TIMER_ID']
  'playback/SET_DEVICE_ID': PlaybackMutations['SET_DEVICE_ID']
  'playback/SET_ACTIVE_DEVICE_ID': PlaybackMutations['SET_ACTIVE_DEVICE_ID']
  'playback/SET_DEVICE_LIST': PlaybackMutations['SET_DEVICE_LIST']
  'playback/SET_CUSTOM_CONTEXT_URI': PlaybackMutations['SET_CUSTOM_CONTEXT_URI']
  'playback/SET_CUSTOM_TRACK_URI_LIST': PlaybackMutations['SET_CUSTOM_TRACK_URI_LIST']
  'playback/SET_TRACK_INDEX': PlaybackMutations['SET_TRACK_INDEX']
  'playback/SET_RECENTLY_PLAYED': PlaybackMutations['SET_RECENTLY_PLAYED']
  'playback/SET_CURRENT_TRACK': PlaybackMutations['SET_CURRENT_TRACK']
  'playback/SET_NEXT_TRACK_LIST': PlaybackMutations['SET_NEXT_TRACK_LIST']
  'playback/SET_PREVIOUS_TRACK_LIST': PlaybackMutations['SET_PREVIOUS_TRACK_LIST']
  'playback/SET_IS_SAVED_TRACK': PlaybackMutations['SET_IS_SAVED_TRACK']
  'playback/SET_IS_PLAYING': PlaybackMutations['SET_IS_PLAYING']
  'playback/SET_CONTEXT_URI': PlaybackMutations['SET_CONTEXT_URI']
  'playback/SET_POSITION_MS': PlaybackMutations['SET_POSITION_MS']
  'playback/SET_DURATION_MS': PlaybackMutations['SET_DURATION_MS']
  'playback/SET_DISABLED_PLAYING_FROM_BEGINING': PlaybackMutations['SET_DISABLED_PLAYING_FROM_BEGINING']
  'playback/SET_IS_SHUFFLED': PlaybackMutations['SET_IS_SHUFFLED']
  'playback/SET_REPEAT_MODE': PlaybackMutations['SET_REPEAT_MODE']
  'playback/SET_DISALLOWS': PlaybackMutations['SET_DISALLOWS']
  'playback/SET_VOLUME_PERCENT': PlaybackMutations['SET_VOLUME_PERCENT']
  'playback/SET_IS_MUTED': PlaybackMutations['SET_IS_MUTED']
};

const mutations: Mutations<PlaybackState, PlaybackMutations> = {
  SET_GET_CURRENT_PLAYBACK_TIMER_ID(state, timer) {
    const { getCurrentPlaybackTimer } = state;
    if (typeof getCurrentPlaybackTimer === 'number') {
      // クライアントサイドで実行
      window.clearTimeout(getCurrentPlaybackTimer);
    } else if (getCurrentPlaybackTimer != null) {
      // サーバーサイドで実行
      clearTimeout(getCurrentPlaybackTimer);
    }

    state.getCurrentPlaybackTimer = timer;
  },

  SET_DEVICE_ID(state, deviceId) {
    state.deviceId = deviceId;
  },

  SET_ACTIVE_DEVICE_ID(state, activeDeviceId) {
    state.activeDeviceId = activeDeviceId;
  },

  SET_DEVICE_LIST(state, deviceList) {
    state.deviceList = deviceList;
  },

  SET_CUSTOM_CONTEXT_URI(state, contextUri) {
    state.customContextUri = contextUri;
  },

  SET_CUSTOM_TRACK_URI_LIST(state, trackUriList) {
    state.customTrackUriList = trackUriList;
  },

  SET_TRACK_INDEX(state, trackIndex) {
    state.trackIndex = trackIndex;
  },

  SET_RECENTLY_PLAYED(state, recentlyPlayed) {
    state.recentlyPlayed = recentlyPlayed;
  },

  SET_CURRENT_TRACK(state, currentTrack) {
    state.trackName = currentTrack?.name;
    state.trackId = currentTrack?.id ?? undefined;
    state.trackUri = currentTrack?.uri;
    state.trackType = currentTrack?.type;
    state.linkedFrom = currentTrack?.linked_from;

    state.images = currentTrack?.album.images;
    state.releaseName = currentTrack?.album.name;
    state.releaseUri = currentTrack?.album.uri;

    state.artists = currentTrack?.artists.map((artist) => ({
      ...artist,
      id: convertUriToId(artist.uri),
    }));
  },

  SET_NEXT_TRACK_LIST(state, nextTrackList) {
    state.nextTrackList = nextTrackList;
  },

  SET_PREVIOUS_TRACK_LIST(state, previousTrackList) {
    state.previousTrackList = previousTrackList;
  },

  SET_IS_SAVED_TRACK(state, isSavedTrack) {
    state.isSavedTrack = isSavedTrack;
  },

  SET_IS_PLAYING(state, isPlaying) {
    state.isPlaying = isPlaying;
  },

  SET_CONTEXT_URI(state, uri) {
    state.contextUri = uri;
  },

  SET_POSITION_MS(state, positionMs) {
    state.positionMs = positionMs;
    state.disabledPlayingFromBegining = positionMs <= 1000;
  },

  SET_DURATION_MS(state, durationMs) {
    // デフォルト値は DEFAULT_DURATION_MS
    state.durationMs = durationMs ?? DEFAULT_DURATION_MS;
  },

  SET_DISABLED_PLAYING_FROM_BEGINING(state, disabledPlayingFromBegining) {
    state.disabledPlayingFromBegining = disabledPlayingFromBegining;
  },

  SET_IS_SHUFFLED(state, isShuffled) {
    state.isShuffled = isShuffled;
  },

  SET_REPEAT_MODE(state, repeatMode) {
    state.repeatMode = repeatMode;
  },

  SET_DISALLOWS(state, disallows) {
    state.disallows = disallows;
  },

  SET_VOLUME_PERCENT(state, { volumePercent }) {
    state.volumePercent = volumePercent;
  },

  SET_IS_MUTED(state, isMuted) {
    state.isMuted = isMuted;
  },
};

export default mutations;
