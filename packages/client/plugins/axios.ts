/* eslint-disable no-param-reassign */
import urljoin from 'url-join';
import type { Plugin } from '@nuxt/types';

import {
  SPOTIFY_API_URL,
  CLIENT_ORIGIN,
  PROXY_API_PREFIX,
  SERVER_API_PREFIX,
} from '~/constants';
import { httpsAgent } from '~/config/httpsAgent';

const injector: Plugin = ({ $axios, app }, inject) => {
  /**
   * Spotify API と通信する axios インスタンス
   */
  const spotifyApi = $axios.create({ baseURL: SPOTIFY_API_URL });

  spotifyApi.onRequest((config) => {
    const accessToken = app.$getters()['auth/accessToken'];
    if (accessToken != null) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
  });

  spotifyApi.onResponse(() => {
    // アクセストークンの期限が切れていたらリクエストが終わった後に更新
    if (app.$getters()['auth/isTokenExpired']() && !app.$getters()['auth/isRefreshing']) {
      app.$dispatch('auth/refreshAccessToken');
    }
  });

  spotifyApi.onResponseError((err) => {
    // TODO:
    if (err.response?.status === 401) {
      app.$dispatch('auth/refreshAccessToken');
    } else if (err.message.includes('Network Error')) {
      // ネットワークエラーだった場合は polling を中止
      app.$commit('playback/SET_POLLING_PLAYBACK_TIMER', undefined);
      app.$toast.set({
        color: 'error',
        message: 'ネットワークエラーが発生しました。接続を確認してください。',
        timeout: 1000 * 30,
      });
    }
    throw err;
  });

  inject('spotifyApi', spotifyApi);


  /**
   * server と通信する axios インスタンス
   */
  const serverApi = $axios.create({
    baseURL: urljoin(CLIENT_ORIGIN, PROXY_API_PREFIX, SERVER_API_PREFIX),
    // Send Cookies
    withCredentials: true,
    httpsAgent,
  });

  inject('serverApi', serverApi);
};

export default injector;
