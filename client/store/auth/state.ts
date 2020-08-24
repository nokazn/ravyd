import { SpotifyAPI } from '~~/types';

export type AuthState = {
  accessToken: string | undefined;
  expirationMs: number | undefined
  userData: SpotifyAPI.UserData | undefined;
}

const state = (): AuthState => ({
  accessToken: undefined,
  expirationMs: undefined,
  userData: undefined,
});

export default state;
