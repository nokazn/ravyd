import type { SpotifyAPI } from 'shared/types';
import type { App } from '~/entities';

export type State = {
  recentlyPlayed: SpotifyAPI.Player.History[];
  historyList: App.PlaylistTrackDetail[];
};

const state = (): State => ({
  recentlyPlayed: [],
  historyList: [],
});

export default state;
