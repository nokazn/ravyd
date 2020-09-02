import { SpotifyAPI } from '~~/types';

export type LibraryHistoryState = {
  recentlyPlayed: SpotifyAPI.Player.RecentlyPlayed | undefined
}

const state = (): LibraryHistoryState => ({
  recentlyPlayed: undefined,
});

export default state;
