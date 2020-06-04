import type { SpotifyAPI, App } from '~~/types';

export type PlayerState = {
  playbackPlayer: Spotify.SpotifyPlayer | undefined
  deviceId: string | undefined
  activeDeviceList: SpotifyAPI.Device[]
  contextUri: string | undefined
  trackName: string | undefined
  trackId: string | undefined
  trackUri: string | undefined
  albumName: string | undefined
  albumUri: string | undefined
  albumArtWorkList: SpotifyAPI.Image[] | undefined
  artistList: App.SimpleArtistInfo[] | undefined
  nextTrackList: Spotify.Track[]
  previousTrackList: Spotify.Track[]
  recentlyPlayed: SpotifyAPI.Player.RecentlyPlayed | undefined
  isSavedTrack: boolean
  isPlaying: boolean
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
  albumArtWorkList: undefined,
  contextUri: undefined,
  trackName: undefined,
  trackId: undefined,
  trackUri: undefined,
  albumName: undefined,
  albumUri: undefined,
  artistList: [],
  nextTrackList: [],
  previousTrackList: [],
  recentlyPlayed: undefined,
  isSavedTrack: false,
  isPlaying: false,
  position: 0,
  duration: 0,
  isShuffled: false,
  repeatMode: 0,
  disallowList: [],
  volume: 0,
  isMuted: false,
});

export default state;
