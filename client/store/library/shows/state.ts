import { SpotifyAPI } from '~~/types';

export type LibraryShowsState = {
  showList: SpotifyAPI.SimpleShow[];
  total: number | undefined;
  unupdatedCounts: number;
  actualIsSavedMap: Map<string, boolean>;
}

const state = (): LibraryShowsState => ({
  showList: [],
  total: undefined,
  unupdatedCounts: 0,
  actualIsSavedMap: new Map(),
});

export default state;
