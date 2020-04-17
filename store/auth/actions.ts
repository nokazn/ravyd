import { Actions } from 'vuex';
import { AuthState } from './state';
import { AuthGetters } from './getters';
import { AuthMutations } from './mutations';
import { Spotify } from '@/types';

export type AuthActions = {
  exchangeCodeToAccessToken: (code: string) => Promise<void>
  getUserData: () => Promise<void>
  refreshAccessToken: () => Promise<void>
  logout: () => void
}

export type RootActions = {
  'auth/exchangeCodeToAccessToken': AuthActions['exchangeCodeToAccessToken']
  'auth/getUserData': AuthActions['getUserData']
  'auth/refreshAccessToken': AuthActions['refreshAccessToken']
  'auth/logout': AuthActions['logout']
}

const actions: Actions<AuthState, AuthActions, AuthGetters, AuthMutations> = {
  async exchangeCodeToAccessToken({ commit }, code): Promise<void> {
    const { data: accessToken }: { data: Spotify.Auth.TokenResponseData['access_token'] } = await this.$axios({
      method: 'POST',
      url: `${process.env.BASE_URL}/api/auth/callback`,
      params: {
        code,
      },
    });
    commit('setToken', accessToken);
  },

  async getUserData({ state, commit }): Promise<void> {
    if (state.accessToken == null) return;

    const res = await this.$axios({
      method: 'GET',
      url: 'https://api.spotify.com/v1/me',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${state.accessToken}`,
      },
    }).catch((e: Error) => {
      console.error(e);
      return null;
    });
    commit('setUserData', res?.data);
  },

  async refreshAccessToken({ commit }) {
    const { data: accessToken }: { data: Spotify.Auth.TokenResponseData['access_token'] } = await this.$axios({
      method: 'GET',
      url: `${process.env.BASE_URL}/api/auth/refresh`,
    });
    commit('setToken', accessToken);
  },

  logout({ commit }) {
    commit('setToken', null);
    commit('setUserData', null);
  },
};

export default actions;
