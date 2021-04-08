import type { SpotifyAPI } from 'shared/types';

export type State = {
  artistList: SpotifyAPI.Artist[];
  total: number | undefined;
  unacquiredArtists: number;
  actualIsSavedMap: Map<string, boolean>;
};

const state = (): State => ({
  artistList: [],
  total: undefined,
  unacquiredArtists: 0,
  actualIsSavedMap: new Map(),
});

export default state;
