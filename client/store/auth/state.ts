import { SpotifyAPI } from '~~/types';

export type AuthState = {
  accessToken: string | undefined;
  expireMillis: number | undefined
  userData: SpotifyAPI.UserData | undefined;
  refreshTokenTimerId: ReturnType<typeof setTimeout> | undefined
}

const state = (): AuthState => ({
  accessToken: undefined,
  expireMillis: undefined,
  userData: undefined,
  refreshTokenTimerId: undefined,
});

export default state;
