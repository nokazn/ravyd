import type { SpotifyAPI } from '~~/types';

export type PlayerState = {
  deviceId: string | null
  activeDeviceList: SpotifyAPI.Device[]
  artWorkSrc: string | null
  trackName: string | null
  trackId: string | null
  artistList: {
    name: string
    id: string
  }[] | null
  nextTrackList: Spotify.Track[]
  previousTrackList: Spotify.Track[]
  recentlyPlayed: SpotifyAPI.Player.RecentlyPlayed | null
  isPlaying: boolean
  position: number
  duration: number
  isShuffled: boolean
  repeatMode: number
  volume: number
}

const state: (() => PlayerState) = () => ({
  deviceId: null,
  activeDeviceList: [],
  artWorkSrc: null,
  trackName: null,
  trackId: null,
  artistList: [],
  nextTrackList: [],
  previousTrackList: [],
  recentlyPlayed: null,
  isPlaying: false,
  position: 0,
  duration: 0,
  isShuffled: false,
  repeatMode: 0,
  volume: 0,
});

export default state;
