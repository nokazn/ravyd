import { Actions } from 'vuex';
import { AuthState } from './state';
import { AuthGetters } from './getters';
import { AuthMutations } from './mutations';
import { ServerAPI } from '~~/types';

export type AuthActions = {
  login: () => Promise<void>
  exchangeCodeToAccessToken: (code: string) => Promise<void>
  getUserData: () => Promise<void>
  getAccessToken: () => Promise<void>
  refreshAccessToken: () => Promise<void>
  logout: () => void
}

export type RootActions = {
  'auth/login': AuthActions['login']
  'auth/exchangeCodeToAccessToken': AuthActions['exchangeCodeToAccessToken']
  'auth/getUserData': AuthActions['getUserData']
  'auth/getAccessToken': AuthActions['getAccessToken']
  'auth/refreshAccessToken': AuthActions['refreshAccessToken']
  'auth/logout': AuthActions['logout']
}

const actions: Actions<AuthState, AuthActions, AuthGetters, AuthMutations> = {
  async login({ commit, dispatch }) {
    const data: ServerAPI.Auth.Login = await this.$serverApi.$post('/api/auth/login')
      .catch((err: Error) => {
        console.error({ err });
        return {};
      });

    if (data.accessToken != null && data.expireIn != null) {
      commit('SET_TOKEN', data.accessToken);
      commit('SET_EXPIRE_MILLIS', data.expireIn);

      await dispatch('getUserData');
      // @todo
      this.$router.push('/');
      return;
    } if (data.url != null) {
      window.location.href = data.url;
      return;
    }

    console.error('トークン取得時にエラーが発生しました。');
    this.$toast.show('error', 'トークン取得時にエラーが発生し、ログインできません。');
  },

  async exchangeCodeToAccessToken({ commit }, code): Promise<void> {
    const { accessToken, expireIn }: ServerAPI.Auth.Token = await this.$serverApi.$post('/api/auth/login/callback', { code })
      .catch((err: Error) => {
        console.error({ err });
        return {};
      });

    commit('SET_TOKEN', accessToken);
    commit('SET_EXPIRE_MILLIS', expireIn);
  },

  async getAccessToken({ commit }) {
    const { accessToken, expireIn }: ServerAPI.Auth.Token = await this.$serverApi.$get('/api/auth')
      .catch((err) => {
        console.error({ err });
        return {};
      });

    commit('SET_TOKEN', accessToken);
    commit('SET_EXPIRE_MILLIS', expireIn);
  },

  async getUserData({ state, commit }): Promise<void> {
    if (state.accessToken == null) return;

    const userData = await this.$spotify.user.getCurrentUserProfile();

    commit('SET_USER_DATA', userData);
  },

  async refreshAccessToken({ getters, commit, dispatch }) {
    if (!getters.isTokenExpired()) return;

    // 先に expireIn を設定しておき、他の action で refreshAccessToken されないようにする
    commit('SET_EXPIRE_MILLIS', undefined);

    const { accessToken, expireIn }: ServerAPI.Auth.Token = await this.$serverApi.$post('/api/auth/refresh')
      .catch((err: Error) => {
        console.error({ err });
        return {};
      });

    commit('SET_TOKEN', accessToken);
    commit('SET_EXPIRE_MILLIS', expireIn);
    commit('CLEAR_REFRESH_TOKEN_TIMER');

    if (accessToken == null) {
      dispatch('logout');
      return;
    }

    // 50 分後にまだトークンが更新されてなかった場合更新
    const time = 1000 * 60 * 50;
    const refreshTokenTimer = setTimeout(() => {
      // time 経過後の状態を取得するため、引数の getters ではなく context から呼び出している
      if (this.$getters()['auth/isTokenExpired']) {
        dispatch('refreshAccessToken');
      }
    }, time);

    commit('SET_REFRESH_TOKEN_TIMER_ID', refreshTokenTimer);
  },

  async logout({ commit, dispatch }) {
    dispatch('player/disconnectPlayer', undefined, { root: true });
    // セッションを削除
    await this.$serverApi.$post('/api/auth/logout')
      .catch((err: Error) => {
        console.error({ err });
      });

    commit('SET_TOKEN', undefined);
    commit('SET_USER_DATA', undefined);
  },
};

export default actions;
