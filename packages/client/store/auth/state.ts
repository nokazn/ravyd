import type { SpotifyAPI } from 'shared/types';

export type State = {
  authState: string | undefined;
  accessToken: string | undefined;
  expirationMs: number | undefined
  user: SpotifyAPI.User | undefined;
  isRefreshing: boolean;
}

const state = (): State => ({
  authState: undefined,
  accessToken: undefined,
  expirationMs: undefined,
  user: undefined,
  isRefreshing: false,
});

export default state;
