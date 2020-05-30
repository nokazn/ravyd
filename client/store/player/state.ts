import type { SpotifyAPI, App } from '~~/types';

export type PlayerState = {
  playbackPlayer: Spotify.SpotifyPlayer | null
  deviceId: string | null
  activeDeviceList: SpotifyAPI.Device[]
  contextUri: string | null
  trackName: string | null
  trackId: string | null
  trackUri: string | null
  albumName: string | null
  albumUri: string | null
  albumArtWorkList: SpotifyAPI.Image[] | null
  artistList: App.SimpleArtistInfo[] | null
  nextTrackList: Spotify.Track[]
  previousTrackList: Spotify.Track[]
  recentlyPlayed: SpotifyAPI.Player.RecentlyPlayed | null
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
  playbackPlayer: null,
  deviceId: null,
  activeDeviceList: [],
  albumArtWorkList: null,
  contextUri: null,
  trackName: null,
  trackId: null,
  trackUri: null,
  albumName: null,
  albumUri: null,
  artistList: [],
  nextTrackList: [],
  previousTrackList: [],
  recentlyPlayed: null,
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
