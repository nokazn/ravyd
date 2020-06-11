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
  nextTrackList: Spotify.Track[]
  previousTrackList: Spotify.Track[]
  recentlyPlayed: SpotifyAPI.Player.RecentlyPlayed | undefined
  isPlaying: boolean
  isSavedTrack: boolean
  position: number
  duration: number
  isShuffled: boolean
  repeatMode: 0 | 1 | 2
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
  nextTrackList: [],
  previousTrackList: [],
  recentlyPlayed: undefined,
  isPlaying: false,
  isSavedTrack: false,
  position: 0,
  duration: 0,
  isShuffled: false,
  repeatMode: 0,
  disallowList: [],
  volume: 0,
  isMuted: false,
});

export default state;
