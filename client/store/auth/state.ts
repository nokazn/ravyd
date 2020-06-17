import { SpotifyAPI } from '~~/types';

export type AuthState = {
  accessToken: string | undefined;
  expireMillis: number | undefined
  userData: SpotifyAPI.UserData | undefined;
}

const state = (): AuthState => ({
  accessToken: undefined,
  expireMillis: undefined,
  userData: undefined,
});

export default state;
