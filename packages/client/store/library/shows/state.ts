import type { SpotifyAPI } from 'shared/types';

export type State = {
  showList: SpotifyAPI.SimpleShow[];
  total: number | undefined;
  unacquiredShows: number;
  actualIsSavedMap: Map<string, boolean>;
};

const state = (): State => ({
  showList: [],
  total: undefined,
  unacquiredShows: 0,
  actualIsSavedMap: new Map(),
});

export default state;
