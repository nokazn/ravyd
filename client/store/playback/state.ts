import type { SpotifyAPI, App, ZeroToHundred } from '~~/types';

export type PlaybackState = {
  pollingPlaybackTimer: ReturnType<typeof setTimeout> | number | undefined
  deviceId: string | undefined
  activeDeviceId: string | undefined
  deviceList: SpotifyAPI.Device[]
  isPlaybackSleep: boolean
  contextUri: string | undefined
  trackId: string | undefined
  trackName: string | undefined
  trackUri: string | undefined
  trackType: Spotify.Track['type'] | undefined
  trackIndex: number | undefined
  linkedFrom: SpotifyAPI.LinkedTrack | undefined
  releaseName: string | undefined
  releaseUri: string | undefined
  images: SpotifyAPI.Image[] | undefined
  artists: App.SimpleArtistInfo[] | undefined
  customContextUri: string | undefined
  customTrackUriList: string[] | undefined
  nextTrackList: Spotify.Track[]
  previousTrackList: Spotify.Track[]
  isPlaying: boolean
  isSavedTrack: boolean
  positionMs: number
  disabledPlayingFromBegining: boolean
  durationMs: number
  isShuffled: boolean
  repeatMode: 0 | 1 | 2 | undefined
  disallows: SpotifyAPI.Disallows
  volumePercent: ZeroToHundred
  isMuted: boolean
}

const state = (): PlaybackState => ({
  pollingPlaybackTimer: undefined,
  deviceId: undefined,
  activeDeviceId: undefined,
  deviceList: [],
  isPlaybackSleep: false,
  images: undefined,
  contextUri: undefined,
  trackId: undefined,
  trackName: undefined,
  trackUri: undefined,
  trackType: undefined,
  trackIndex: undefined,
  linkedFrom: undefined,
  releaseName: undefined,
  releaseUri: undefined,
  artists: [],
  customContextUri: undefined,
  customTrackUriList: undefined,
  nextTrackList: [],
  previousTrackList: [],
  isPlaying: false,
  isSavedTrack: false,
  positionMs: 0,
  disabledPlayingFromBegining: false,
  // if set to 0, Seekbar has 0 length
  durationMs: 1,
  isShuffled: false,
  repeatMode: undefined,
  disallows: {},
  volumePercent: 100,
  isMuted: false,
});

export default state;
