import type { SpotifyAPI } from '@/types';

export type PlayerState = {
  currentlyPlaying: SpotifyAPI.Player.CurrentlyPlaying | null;
  recentlyPlayed: SpotifyAPI.Player.RecentlyPlayed | null;
}

const state: (() => PlayerState) = () => ({
  currentlyPlaying: null,
  recentlyPlayed: null,
});

export default state;
