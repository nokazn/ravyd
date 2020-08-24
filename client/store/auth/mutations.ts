/* eslint-disable no-param-reassign */
import { Mutations } from 'typed-vuex';
import { AuthState } from './state';
import { SpotifyAPI } from '~~/types';

export type AuthMutations = {
  SET_ACCESS_TOKEN: SpotifyAPI.Auth.Token['access_token'] | undefined,
  SET_EXPIRATION_MS: number | undefined
  SET_USER_DATA: SpotifyAPI.UserData |undefined
}

export type RootMutations = {
  'auth/SET_ACCESS_TOKEN': AuthMutations['SET_ACCESS_TOKEN']
  'auth/SET_EXPIRATION_MS': AuthMutations['SET_EXPIRATION_MS']
  'auth/SET_USER_DATA': AuthMutations['SET_USER_DATA']
}

const mutations: Mutations<AuthState, AuthMutations> = {
  SET_ACCESS_TOKEN(state, token): void {
    state.accessToken = token;
  },

  SET_EXPIRATION_MS(state, expireMillis) {
    state.expirationMs = expireMillis != null
      ? Date.now() + expireMillis
      : undefined;
  },

  SET_USER_DATA(state, userData): void {
    state.userData = userData;
  },
};

export default mutations;
