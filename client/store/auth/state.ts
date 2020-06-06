import { SpotifyAPI } from '~~/types';

export type AuthState = {
  accessToken: string | undefined;
  expireMillis: number | undefined
  userData: SpotifyAPI.UserData | null | undefined;
}

const state = (): AuthState => ({
  accessToken: undefined,
  expireMillis: undefined,
  userData: undefined,
});

export default state;
