import { SpotifyAPI } from '~~/types';

export type SearchState = {
  result: SpotifyAPI.SearchResult
}

const state = (): SearchState => ({
  result: {},
});

export default state;
