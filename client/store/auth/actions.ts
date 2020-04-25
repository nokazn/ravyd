import { Actions } from 'vuex';
import { AuthState } from './state';
import { AuthGetters } from './getters';
import { AuthMutations } from './mutations';
import { SpotifyAPI } from '~~/types';

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
    const accessToken: SpotifyAPI.Auth.TokenResponseData['access_token'] = await this.$serverApi.$post('/api/auth/callback', {
      code,
    }).catch((err: Error) => {
      console.error({ err }, err.message);
      return null;
    });

    commit('setToken', accessToken);
  },

  async getUserData({ state, commit }): Promise<void> {
    if (state.accessToken == null) return;

    // @todo
    this.$spotifyApi.setToken(state.accessToken, 'Bearer');
    const userData: SpotifyAPI.Auth.UserData | null = await this.$spotifyApi.$get('/me')
      .catch((err: Error) => {
        console.error({ err });
        return null;
      });

    commit('setUserData', userData);
  },

  async refreshAccessToken({ commit }) {
    const accessToken: SpotifyAPI.Auth.TokenResponseData['access_token'] | null = await this.$serverApi.$get('/api/auth/refresh')
      .catch((err: Error) => {
        console.error(err);
        return null;
      });

    commit('setToken', accessToken);
  },

  logout({ commit }) {
    commit('setToken', null);
    commit('setUserData', null);
  },
};

export default actions;
