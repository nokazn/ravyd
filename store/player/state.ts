import type { SpotifyAPI } from '@/types';

export type PlayerState = {
  deviceId: string | null
  currentlyPlaying: SpotifyAPI.Player.CurrentlyPlaying | null;
  recentlyPlayed: SpotifyAPI.Player.RecentlyPlayed | null;
}

const state: (() => PlayerState) = () => ({
  deviceId: null,
  currentlyPlaying: null,
  recentlyPlayed: null,
});

export default state;
