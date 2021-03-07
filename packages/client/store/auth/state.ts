import type { SpotifyAPI } from 'shared/types';

export type State = {
  authState: string | undefined;
  accessToken: string | undefined;
  expirationMs: number | undefined
  userData: SpotifyAPI.UserData | undefined;
  isRefreshing: boolean;
}

const state = (): State => ({
  authState: undefined,
  accessToken: undefined,
  expirationMs: undefined,
  userData: undefined,
  isRefreshing: false,
});

export default state;
