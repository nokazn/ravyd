import type { SpotifyAPI, App } from '~~/types';

export type PlayerState = {
  playbackPlayer: Spotify.SpotifyPlayer | undefined
  deviceId: string | undefined
  activeDeviceList: SpotifyAPI.Device[]
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
  currentlyPlaying: SpotifyAPI.Player.CurrentlyPlaying | undefined
  recentlyPlayed: SpotifyAPI.Player.RecentlyPlayed | undefined
  isPlaying: boolean
  isSavedTrack: boolean
  position: number
  durationMs: number
  isShuffled: boolean
  repeatMode: 0 | 1 | 2 | undefined
  disallowList: string[]
  volume: number
  isMuted: boolean
}

const state = (): PlayerState => ({
  playbackPlayer: undefined,
  deviceId: undefined,
  activeDeviceList: [],
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
  currentlyPlaying: undefined,
  recentlyPlayed: undefined,
  isPlaying: false,
  isSavedTrack: false,
  position: 0,
  durationMs: 0,
  isShuffled: false,
  repeatMode: undefined,
  disallowList: [],
  volume: 0,
  isMuted: false,
});

export default state;
