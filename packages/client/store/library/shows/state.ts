import type { SpotifyAPI } from 'shared/types';

export type State = {
  showList: SpotifyAPI.SimpleShow[];
  total: number | undefined;
  unupdatedCounts: number;
  actualIsSavedMap: Map<string, boolean>;
};

const state = (): State => ({
  showList: [],
  total: undefined,
  unupdatedCounts: 0,
  actualIsSavedMap: new Map(),
});

export default state;
