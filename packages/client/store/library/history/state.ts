import type { SpotifyAPI } from 'shared/types';
import type { App } from '~/entities';

export type State = {
  recentlyPlayed: SpotifyAPI.Player.History[];
  historyList: App.PlaylistTrackDetail[];
  total: number | undefined;
  unupdatedCounts: number;
};

const state = (): State => ({
  recentlyPlayed: [],
  historyList: [],
  total: undefined,
  unupdatedCounts: 0,
});

export default state;
