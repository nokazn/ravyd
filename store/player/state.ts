import type { Spotify } from '@/types';

export type PlayerState = {
  currentlyPlaying: Spotify.Player.CurrentlyPlaying | null;
  recentlyPlayed: Spotify.Player.RecentlyPlayed | null;
}

const state: (() => PlayerState) = () => ({
  currentlyPlaying: null,
  recentlyPlayed: null,
});

export default state;
