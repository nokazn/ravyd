/* eslint-disable no-param-reassign */
import { Mutations } from 'typed-vuex';
import type { SpotifyAPI } from 'shared/types';
import { AuthState } from './state';

export type AuthMutations = {
  SET_AUTH_STATE: string | undefined | null;
  SET_ACCESS_TOKEN: SpotifyAPI.Auth.Token['access_token'] | undefined | null;
  SET_EXPIRATION_MS: number | undefined;
  SET_USER_DATA: SpotifyAPI.UserData |undefined;
  SET_IS_REFRESHING: boolean;
}

export type RootMutations = {
  'auth/SET_AUTH_STATE': AuthMutations['SET_AUTH_STATE']
  'auth/SET_ACCESS_TOKEN': AuthMutations['SET_ACCESS_TOKEN']
  'auth/SET_EXPIRATION_MS': AuthMutations['SET_EXPIRATION_MS']
  'auth/SET_USER_DATA': AuthMutations['SET_USER_DATA']
  'auth/SET_IS_REFRESHING': AuthMutations['SET_IS_REFRESHING']
}

const mutations: Mutations<AuthState, AuthMutations> = {
  SET_AUTH_STATE(state, authState): void {
    state.authState = authState ?? undefined;
  },

  SET_ACCESS_TOKEN(state, accessToken): void {
    state.accessToken = accessToken ?? undefined;
  },

  SET_EXPIRATION_MS(state, expirationMs) {
    state.expirationMs = expirationMs != null
      ? Date.now() + expirationMs
      : undefined;
  },

  SET_USER_DATA(state, userData): void {
    state.userData = userData;
  },

  SET_IS_REFRESHING(state, isRefreshing) {
    state.isRefreshing = isRefreshing;
  },
};

export default mutations;
