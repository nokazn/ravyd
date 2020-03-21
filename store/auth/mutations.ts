/* eslint-disable no-param-reassign */
import { MutationTree } from 'vuex';
import { AuthState } from './state';
import { Spotify } from '@/types';

const mutations: MutationTree<AuthState> = {
  setToken(state, token: Spotify.Auth.TokenResponseData | null): void {
    state.token = token;
  },

  setUserData(state, userData: Spotify.Auth.UserData | null): void {
    state.userData = userData;
  },
};

export default mutations;
