import httpStatusCodes from 'http-status-codes';
import type { AxiosError } from 'axios';
import type { Actions } from 'typed-vuex';

import type { paths, JSONResponseOf } from 'shared/types';
import type { AuthState } from './state';
import type { AuthGetters } from './getters';
import type { AuthMutations } from './mutations';

export type AuthActions = {
  login: () => Promise<JSONResponseOf<paths['/auth/login']['post']>>
  exchangeCodeWithAccessToken: (params: {
    code: string;
    state: string;
  }) => Promise<JSONResponseOf<paths['/auth/login/callback']['get']>>
  getAccessToken: () => Promise<JSONResponseOf<paths['/auth']['get']>>
  getUserData: () => Promise<void>
  refreshAccessToken: () => Promise<JSONResponseOf<paths['/auth/refresh']['put']> | undefined>
  logout: () => Promise<void>
  confirmAuthState: (params?: { checkPremium?: boolean } | undefined) => Promise<boolean>
}

export type RootActions = {
  'auth/login': AuthActions['login']
  'auth/exchangeCodeWithAccessToken': AuthActions['exchangeCodeWithAccessToken']
  'auth/getUserData': AuthActions['getUserData']
  'auth/getAccessToken': AuthActions['getAccessToken']
  'auth/refreshAccessToken': AuthActions['refreshAccessToken']
  'auth/logout': AuthActions['logout']
  'auth/confirmAuthState': AuthActions['confirmAuthState']
}

const { CONFLICT } = httpStatusCodes;

const actions: Actions<AuthState, AuthActions, AuthGetters, AuthMutations> = {
  async login({ commit, dispatch }) {
    const data = await this.$server.auth.login();
    if (data.authenticated) {
      commit('SET_TOKEN', data);
      await dispatch('getUserData');
      // TODO: リダイレクト先
      this.$router.push('/');
    } else if (data.url != null) {
      // TODO:
      window.location.href = data.url;
    } else {
      console.error('An error occurred on obtaining an access token.');
      this.$toast.pushError('トークン取得時にエラーが発生し、ログインできません。');
    }
    return data;
  },

  async exchangeCodeWithAccessToken({ commit }, { code, state }) {
    const data = await this.$server.auth.callback({ code, state });
    if (data.authState != null) {
      commit('SET_TOKEN', data);
    }
    return data;
  },

  async getAccessToken({ commit }) {
    const data = await this.$server.auth.root();
    commit('SET_TOKEN', data.authenticated ? data : undefined);
    return data;
  },

  async getUserData({ state, commit }): Promise<void> {
    if (state.accessToken != null) {
      const userData = await this.$spotify.users.getCurrentUserProfile();
      commit('SET_USER_DATA', userData);
    }
  },

  async refreshAccessToken({
    state,
    getters,
    commit,
    dispatch,
  }) {
    const { authState, accessToken, isRefreshing } = state;
    // 現在ログイン済でないときは更新しない
    if (authState == null || accessToken == null || isRefreshing) {
      return Promise.resolve(undefined);
    }

    // トークン更新中であれば待機して、期限切れのときのみ更新
    await getters.finishedRefreshingToken();
    if (!getters.isTokenExpired()) {
      return Promise.resolve(undefined);
    }

    commit('SET_IS_REFRESHING', true);
    return this.$server.auth.refresh({ authState, accessToken })
      .then((token) => {
        commit('SET_TOKEN', token.accessToken != null ? token : undefined);
        return token;
      })
      .catch(async (err: AxiosError<JSONResponseOf<paths['/auth/refresh']['put']>>) => {
        console.error({ err });
        if (err.response?.status === CONFLICT) {
          // TODO: check のみにする
          // コンフリクトして現在のトークンが一致しない場合は再取得
          await dispatch('getAccessToken');
        } else {
          commit('SET_TOKEN', undefined);
          await dispatch('logout');
          this.$router.push('/login');
          this.$toast.pushError('トークンを取得できなかったためログアウトしました。');
        }
        return err.response?.data;
      })
      .finally(() => {
        commit('SET_IS_REFRESHING', false);
      });
  },

  async logout({ commit, dispatch }) {
    dispatch('player/disconnectPlayer', undefined, { root: true });
    return this.$server.auth.logout()
      .then(() => {
        commit('SET_TOKEN', undefined);
        commit('SET_USER_DATA', undefined);
        dispatch('playback/resetPlayback', undefined, { root: true });
      });
  },

  async confirmAuthState({ getters, dispatch }, params) {
    if (!getters.isLoggedin || getters.isTokenExpired()) {
      await dispatch('refreshAccessToken');
    }
    return params?.checkPremium
      ? getters.isLoggedin && getters.isPremium
      : getters.isLoggedin;
  },
};

export default actions;
