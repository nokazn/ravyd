import { SpotifyAPI } from '~~/types';

export type AuthState = {
  accessToken: SpotifyAPI.Auth.TokenResponseData['access_token'] | null;
  userData: SpotifyAPI.Auth.UserData | null | undefined;
}

const state = (): AuthState => ({
  accessToken: null,
  userData: undefined,
});

export default state;
