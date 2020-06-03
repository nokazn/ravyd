/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { AuthState } from './state';
import { SpotifyAPI } from '~~/types';

export type AuthMutations = {
  SET_TOKEN: SpotifyAPI.Auth.TokenResponseData['access_token'] | null,
  SET_USER_DATA: SpotifyAPI.UserData | null
}

export type RootMutations = {
  ['auth/SET_TOKEN']: AuthMutations['SET_TOKEN']
  ['auth/SET_USER_DATA']: AuthMutations['SET_USER_DATA']
}

const mutations: Mutations<AuthState, AuthMutations> = {
  SET_TOKEN(state, token): void {
    state.accessToken = token;
  },

  SET_USER_DATA(state, userData): void {
    state.userData = userData;
  },
};

export default mutations;
