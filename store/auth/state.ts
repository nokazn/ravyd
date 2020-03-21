/* eslint-disable camelcase */
import { Spotify } from '@/types';

export type AuthState = {
  token: Spotify.Auth.TokenResponseData | null;
  userData: Spotify.Auth.UserData | null;
}

const state: (() => AuthState) = () => ({
  token: null,
  userData: null,
});

export default state;
