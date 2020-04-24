import type { SpotifyAPI } from '~~/types';

export type PlayerState = {
  deviceId: string | null
  currentlyPlaying: SpotifyAPI.Player.CurrentlyPlaying | null
  recentlyPlayed: SpotifyAPI.Player.RecentlyPlayed | null
  isPlaying: boolean
  volume: number
}

const state: (() => PlayerState) = () => ({
  deviceId: null,
  currentlyPlaying: null,
  recentlyPlayed: null,
  isPlaying: false,
  volume: 0,
});

export default state;
