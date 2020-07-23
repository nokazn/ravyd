/* eslint-disable no-param-reassign */
import { Mutations } from 'typed-vuex';
import { AuthState } from './state';
import { SpotifyAPI } from '~~/types';

export type AuthMutations = {
  SET_TOKEN: SpotifyAPI.Auth.Token['access_token'] | undefined,
  SET_EXPIRE_MILLIS: number | undefined
  CLEAR_REFRESH_TOKEN_TIMER: void
  SET_REFRESH_TOKEN_TIMER_ID: ReturnType<typeof setTimeout> | undefined
  SET_USER_DATA: SpotifyAPI.UserData |undefined
}

export type RootMutations = {
  ['auth/SET_TOKEN']: AuthMutations['SET_TOKEN']
  ['auth/SET_EXPIRE_MILLIS']: AuthMutations['SET_EXPIRE_MILLIS']
  ['auth/RESET_EXPIRE_MILLIS']: AuthMutations['SET_EXPIRE_MILLIS']
  ['auth/CLEAR_REFRESH_TOKEN_TIMER']: AuthMutations['CLEAR_REFRESH_TOKEN_TIMER']
  ['auth/SET_REFRESH_TOKEN_TIMER_ID']: AuthMutations['SET_REFRESH_TOKEN_TIMER_ID']
  ['auth/SET_USER_DATA']: AuthMutations['SET_USER_DATA']
}

const mutations: Mutations<AuthState, AuthMutations> = {
  SET_TOKEN(state, token): void {
    state.accessToken = token;
  },

  SET_EXPIRE_MILLIS(state, expireMillis) {
    state.expireMillis = expireMillis != null
      ? Date.now() + expireMillis
      : undefined;
  },

  CLEAR_REFRESH_TOKEN_TIMER(state) {
    if (state.refreshTokenTimerId != null) {
      clearTimeout(state.refreshTokenTimerId);
      state.refreshTokenTimerId = undefined;
    }
  },

  SET_REFRESH_TOKEN_TIMER_ID(state, timerId) {
    state.refreshTokenTimerId = timerId;
  },

  SET_USER_DATA(state, userData): void {
    state.userData = userData;
  },
};

export default mutations;
