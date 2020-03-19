import { Spotify } from '@/types';

export type AuthState = {
  token: Spotify.Auth.TokenResponseData | null;
}

const state: (() => AuthState) = () => ({
  token: null,
});

export default state;
