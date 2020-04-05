import { Spotify } from '@/types';

export type AuthState = {
  accessToken: Spotify.Auth.TokenResponseData['access_token'] | null;
  userData: Spotify.Auth.UserData | null | undefined;
}

const state: (() => AuthState) = () => ({
  accessToken: null,
  userData: undefined,
});

export default state;
