import type { SpotifyAPI, App } from '~~/types';

export type PlayerState = {
  playbackPlayer: Spotify.SpotifyPlayer | undefined
  deviceId: string | undefined
  activeDeviceId: string | undefined
  deviceList: SpotifyAPI.Device[]
  contextUri: string | undefined
  trackId: string | undefined
  trackName: string | undefined
  trackUri: string | undefined
  releaseName: string | undefined
  releaseUri: string | undefined
  artWorkList: SpotifyAPI.Image[] | undefined
  artistList: App.SimpleArtistInfo[] | undefined
  customContextUri: string | undefined
  customTrackUriList: string[] | undefined
  nextTrackList: Spotify.Track[]
  previousTrackList: Spotify.Track[]
  recentlyPlayed: SpotifyAPI.Player.RecentlyPlayed | undefined
  isPlaying: boolean
  isSavedTrack: boolean
  positionMs: number
  durationMs: number
  isShuffled: boolean
  repeatMode: 0 | 1 | 2 | undefined
  disallowList: string[]
  volumePercent: number
  isMuted: boolean
}

const state = (): PlayerState => ({
  playbackPlayer: undefined,
  deviceId: undefined,
  activeDeviceId: undefined,
  deviceList: [],
  artWorkList: undefined,
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
  durationMs: 0,
  isShuffled: false,
  repeatMode: undefined,
  disallowList: [],
  volumePercent: 0,
  isMuted: false,
});

export default state;
