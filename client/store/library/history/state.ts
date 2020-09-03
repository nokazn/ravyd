import { SpotifyAPI, App } from '~~/types';

export type LibraryHistoryState = {
  recentlyPlayed: SpotifyAPI.Player.History[]
  trackHistoryList: App.PlaylistTrackDetail[]
  total: number | undefined
  unupdatedCounts: number
}

const state = (): LibraryHistoryState => ({
  recentlyPlayed: [],
  trackHistoryList: [],
  total: undefined,
  unupdatedCounts: 0,
});

export default state;
