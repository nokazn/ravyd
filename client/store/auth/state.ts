import type { SpotifyAPI } from 'shared/types';

export type AuthState = {
  accessToken: string | undefined;
  expirationMs: number | undefined
  userData: SpotifyAPI.UserData | undefined;
  isRefreshing: boolean;
}

const state = (): AuthState => ({
  accessToken: undefined,
  expirationMs: undefined,
  userData: undefined,
  isRefreshing: false,
});

export default state;
