import { AxiosResponse } from 'axios';
import { Actions } from 'typed-vuex';
import { AuthState } from './state';
import { AuthGetters } from './getters';
import { AuthMutations } from './mutations';
import { ServerAPI } from '~~/types';

export type AuthActions = {
  login: () => Promise<void>
  exchangeCodeToAccessToken: (params: {
    code: string;
    state: string;
  }) => Promise<void>
  getUserData: () => Promise<void>
  getAccessToken: () => Promise<void>
  refreshAccessToken: () => Promise<void>
  logout: () => Promise<void>
  confirmAuthState: () => Promise<boolean>
}

export type RootActions = {
  'auth/login': AuthActions['login']
  'auth/exchangeCodeToAccessToken': AuthActions['exchangeCodeToAccessToken']
  'auth/getUserData': AuthActions['getUserData']
  'auth/getAccessToken': AuthActions['getAccessToken']
  'auth/refreshAccessToken': AuthActions['refreshAccessToken']
  'auth/logout': AuthActions['logout']
  'auth/confirmAuthState': AuthActions['confirmAuthState']
}

const actions: Actions<AuthState, AuthActions, AuthGetters, AuthMutations> = {
  async login({ commit, dispatch }) {
    const data: ServerAPI.Auth.Login = await this.$serverApi.$post('/auth/login')
      .catch((err: Error) => {
        console.error({ err });
        return {};
      });

    if (data.accessToken != null && data.expireIn != null) {
      commit('SET_ACCESS_TOKEN', data.accessToken);
      commit('SET_EXPIRATION_MS', data.expireIn);

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

  async exchangeCodeToAccessToken({ commit }, { code, state }) {
    const {
      accessToken,
      expireIn,
    }: ServerAPI.Auth.Token = await this.$serverApi.$get('/auth/login/callback', {
      params: {
        code,
        state,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return {};
    });

    commit('SET_ACCESS_TOKEN', accessToken);
    commit('SET_EXPIRATION_MS', expireIn);
  },

  async getAccessToken({ commit }) {
    const {
      accessToken,
      expireIn,
    }: ServerAPI.Auth.Token = await this.$serverApi.$get('/auth')
      .catch((err: Error) => {
        console.error({ err });
        return {};
      });

    commit('SET_ACCESS_TOKEN', accessToken);
    commit('SET_EXPIRATION_MS', expireIn);
  },

  async getUserData({ state, commit }): Promise<void> {
    if (state.accessToken == null) return;

    const userData = await this.$spotify.users.getCurrentUserProfile();

    commit('SET_USER_DATA', userData);
  },

  // @todo
  async refreshAccessToken({
    state,
    getters,
    commit,
    dispatch,
  }) {
    // 現在ログイン済でアクセストークンの期限が切れている場合のみ更新
    if (!getters.isLoggedin || !getters.isTokenExpired()) return;

    // 先に expireIn を設定しておき、他の action で refreshAccessToken されないようにする
    const currentExpirationMs = state.expirationMs;
    commit('SET_EXPIRATION_MS', undefined);

    const res: AxiosResponse<ServerAPI.Auth.Token> | undefined = await this.$serverApi.post('/auth/refresh', {
      accessToken: state.accessToken,
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });

    // アクセストークンが取得できなかった場合はログアウト
    if (res?.data.accessToken == null) {
      commit('SET_ACCESS_TOKEN', undefined);
      commit('SET_EXPIRATION_MS', undefined);

      await dispatch('logout');
      this.$router.push('/login');
      this.$toast.show('error', 'トークンを取得できなかったためログアウトしました。');
      return;
    }

    const { accessToken, expireIn } = res.data;

    // 現在のトークンが一致しない場合 (204) はトークンを更新しない
    if (res.status === 200) {
      commit('SET_ACCESS_TOKEN', accessToken);
      commit('SET_EXPIRATION_MS', expireIn);
    } else {
      // 一度リセットした expirationMs を元に戻す
      commit('SET_EXPIRATION_MS', currentExpirationMs);
    }
  },

  async logout({ commit, dispatch }) {
    // プレイヤーをリセット
    dispatch('player/disconnectPlayer', undefined, { root: true });
    // セッションを削除
    await this.$serverApi.$post('/auth/logout')
      .catch((err: Error) => {
        console.error({ err });
      });

    commit('SET_ACCESS_TOKEN', undefined);
    commit('SET_USER_DATA', undefined);
    // playback をリセット
    dispatch('playback/resetPlayback', undefined, { root: true });
  },

  async confirmAuthState({ getters, dispatch }) {
    if (!getters.isLoggedin) {
      await dispatch('refreshAccessToken');
    }
    return getters.isLoggedin ?? false;
  },
};

export default actions;
