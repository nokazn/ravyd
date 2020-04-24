/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { AuthState } from './state';
import { SpotifyAPI } from '~~/types';

export type AuthMutations = {
  setToken: SpotifyAPI.Auth.TokenResponseData['access_token'] | null,
  setUserData: SpotifyAPI.Auth.UserData | null
}

export type RootMutations = {
  ['auth/setToken']: AuthMutations['setToken']
  ['auth/setUserData']: AuthMutations['setUserData']
}

const mutations: Mutations<AuthState, AuthMutations> = {
  setToken(state, token): void {
    state.accessToken = token;
  },

  setUserData(state, userData): void {
    state.userData = userData;
  },
};

export default mutations;
