/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { AuthState } from './state';
import { Spotify } from '@/types';

export type AuthMutations = {
  setToken: Spotify.Auth.TokenResponseData['access_token'] | null,
  setUserData: Spotify.Auth.UserData | null
}

export type RootMutations = {
  ['auth/setToken']: AuthMutations['setToken']
  ['auth/setUserData']: AuthMutations['setUserData']
}

const mutations: Mutations<AuthState, AuthMutations> = {
  setToken(state, token): void {
    state.accessToken = token ?? null;
  },

  setUserData(state, userData): void {
    state.userData = userData;
  },
};

export default mutations;
