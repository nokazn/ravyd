import { MutationTree } from 'vuex';
import { AuthState } from './state';
import { Spotify } from '@/types';

const mutations: MutationTree<AuthState> = {
  setToken(state, token: Spotify.Auth.TokenResponseData) {
    // eslint-disable-next-line no-param-reassign
    state.token = token;
  },
};

export default mutations;
