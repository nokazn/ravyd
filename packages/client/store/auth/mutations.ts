/* eslint-disable no-param-reassign */
import type { VuexMutations } from 'typed-vuex';
import type { SpotifyAPI } from 'shared/types';
import type { State } from './types';

type Token = {
  authState: string;
  accessToken: SpotifyAPI.Auth.Token['access_token'];
  expireIn: number;
}

export type Mutations = {
  SET_TOKEN: Token | undefined;
  SET_AUTH_STATE: string | undefined | null;
  SET_USER_DATA: SpotifyAPI.UserData |undefined;
  SET_IS_REFRESHING: boolean;
}

const mutations: VuexMutations<State, Mutations> = {
  SET_TOKEN(state, token) {
    state.authState = token?.authState;
    state.accessToken = token?.accessToken;
    const expireIn = token?.expireIn || undefined;
    state.expirationMs = expireIn != null
      ? Date.now() + expireIn
      : undefined;
  },

  SET_AUTH_STATE(state, authState) {
    state.authState = authState ?? undefined;
  },

  SET_USER_DATA(state, userData): void {
    state.userData = userData;
  },

  SET_IS_REFRESHING(state, isRefreshing) {
    state.isRefreshing = isRefreshing;
  },
};

export default mutations;
