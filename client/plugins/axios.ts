/* eslint-disable no-param-reassign */
import https from 'https';
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { Plugin } from '@nuxt/types';

const plugin: Plugin = ({ $axios, app }, inject) => {
  /**
   * Spotify API と通信する axios インスタンス
   */
  const spotifyApi = $axios.create({
    baseURL: process.env.SPOTIFY_URL,
  }) as NuxtAxiosInstance;

  spotifyApi.onRequest((config) => {
    const { accessToken } = app.$state().auth;
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  });

  spotifyApi.onResponse(() => {
    // アクセストークンの期限が切れていたらリクエストが終わった後に更新
    app.$dispatch('auth/refreshAccessToken');
  });

  spotifyApi.onResponseError(async (err) => {
    // 認可リクエストによるエラーだった場合はアクセストークンを更新
    if (err.response?.status === 401) {
      await app.$dispatch('auth/refreshAccessToken');
      if (!app.$getters()['auth/isLoggedin']) {
        await app.$dispatch('auth/logout');
        app.$router.push('/login');
        app.$toast.show('error', 'トークンを取得できなかったためログアウトしました。');
      }
    }

    throw new Error(err.message);
  });

  inject('spotifyApi', spotifyApi);

  /**
   * serverMiddleware と通信する axios インスタンス
   */
  const serverApi = $axios.create({
    baseURL: process.env.BASE_URL,
    withCredentials: true,
  }) as NuxtAxiosInstance;

  // 自己証明書によるエラーを回避するため
  if (process.env.NODE_ENV === 'development') {
    const agent = new https.Agent({ rejectUnauthorized: false });
    serverApi.onRequest((config) => {
      config.httpsAgent = agent;
    });
  }

  inject('serverApi', serverApi);
};

export default plugin;
