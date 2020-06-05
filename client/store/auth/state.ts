import { SpotifyAPI } from '~~/types';

export type AuthState = {
  accessToken: string | undefined;
  userData: SpotifyAPI.UserData | null | undefined;
}

const state = (): AuthState => ({
  accessToken: undefined,
  userData: undefined,
});

export default state;
