import type { SpotifyAPI, App, ZeroToHundred } from '~~/types';

export type PlaybackState = {
  getCurrentPlaybackTimer: ReturnType<typeof setTimeout> | number | undefined
  deviceId: string | undefined
  activeDeviceId: string | undefined
  deviceList: SpotifyAPI.Device[]
  contextUri: string | undefined
  trackId: string | undefined
  trackName: string | undefined
  trackUri: string | undefined
  releaseName: string | undefined
  releaseUri: string | undefined
  artworkList: SpotifyAPI.Image[] | undefined
  artistList: App.SimpleArtistInfo[] | undefined
  customContextUri: string | undefined
  customTrackUriList: string[] | undefined
  nextTrackList: Spotify.Track[]
  previousTrackList: Spotify.Track[]
  recentlyPlayed: SpotifyAPI.Player.RecentlyPlayed | undefined
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
  getCurrentPlaybackTimer: undefined,
  deviceId: undefined,
  activeDeviceId: undefined,
  deviceList: [],
  artworkList: undefined,
  contextUri: undefined,
  trackId: undefined,
  trackName: undefined,
  trackUri: undefined,
  releaseName: undefined,
  releaseUri: undefined,
  artistList: [],
  customContextUri: undefined,
  customTrackUriList: undefined,
  nextTrackList: [],
  previousTrackList: [],
  recentlyPlayed: undefined,
  isPlaying: false,
  isSavedTrack: false,
  positionMs: 0,
  disabledPlayingFromBegining: false,
  durationMs: 0,
  isShuffled: false,
  repeatMode: undefined,
  disallows: {},
  volumePercent: 0,
  isMuted: false,
});

export default state;
