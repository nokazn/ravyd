/* eslint-disable no-param-reassign */
import { Mutations } from 'typed-vuex';
import type { SpotifyAPI } from 'shared/types';
import { AuthState } from './state';

type Token = {
  authState: string;
  accessToken: SpotifyAPI.Auth.Token['access_token'];
  expireIn: number;
}

export type AuthMutations = {
  SET_TOKEN: Token | undefined;
  SET_AUTH_STATE: string | undefined | null;
  SET_EXPIRATION_MS: number | undefined;
  SET_USER_DATA: SpotifyAPI.UserData |undefined;
  SET_IS_REFRESHING: boolean;
}

export type RootMutations = {
  'auth/SET_AUTH_STATE': AuthMutations['SET_AUTH_STATE']
  'auth/SET_EXPIRATION_MS': AuthMutations['SET_EXPIRATION_MS']
  'auth/SET_USER_DATA': AuthMutations['SET_USER_DATA']
  'auth/SET_IS_REFRESHING': AuthMutations['SET_IS_REFRESHING']
}

const mutations: Mutations<AuthState, AuthMutations> = {
  SET_TOKEN(state, token) {
    state.authState = token?.authState;
    state.accessToken = token?.accessToken;
    state.expirationMs = token?.expireIn || undefined;
  },

  SET_AUTH_STATE(state, authState) {
    state.authState = authState ?? undefined;
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
