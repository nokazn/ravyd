import type { SpotifyAPI } from '~~/types';

export type PlayerState = {
  deviceId: string | null
  activeDeviceList: SpotifyAPI.Device[]
  currentlyPlaying: SpotifyAPI.Player.CurrentlyPlaying | null
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
  currentlyPlaying: null,
  recentlyPlayed: null,
  isPlaying: false,
  position: 0,
  duration: 0,
  isShuffled: false,
  repeatMode: 0,
  volume: 0,
});

export default state;
