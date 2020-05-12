import type { SpotifyAPI } from '~~/types';

export type PlayerState = {
  deviceId: string | null
  activeDeviceList: SpotifyAPI.Device[]
  artWorkSrc: string | null
  trackName: string | null
  trackId: string | null
  trackUri: string | null
  albumUri: string | null
  artistList: {
    name: string
    id: string
  }[] | null
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
}

const state = (): PlayerState => ({
  deviceId: null,
  activeDeviceList: [],
  artWorkSrc: null,
  trackName: null,
  trackId: null,
  trackUri: null,
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
});

export default state;
