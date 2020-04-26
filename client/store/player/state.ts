import type { SpotifyAPI } from '~~/types';

export type PlayerState = {
  deviceId: string | null
  activeDeviceList: SpotifyAPI.Device[]
  currentlyPlaying: SpotifyAPI.Player.CurrentlyPlaying | null
  recentlyPlayed: SpotifyAPI.Player.RecentlyPlayed | null
  isPlaying: boolean
  volume: number
}

const state: (() => PlayerState) = () => ({
  deviceId: null,
  activeDeviceList: [],
  currentlyPlaying: null,
  recentlyPlayed: null,
  isPlaying: false,
  volume: 0,
});

export default state;
