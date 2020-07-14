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
    // eslint-disable-next-line no-param-reassign
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  });

  spotifyApi.onResponse(() => {
    app.$dispatch('auth/refreshAccessToken');
  });

  spotifyApi.onResponseError((err) => {
    console.error({ err });
    if (err.response?.status === 401) {
      app.$dispatch('auth/refreshAccessToken');
      if (!app.$getters()['auth/isLoggedin']) {
        app.$dispatch('auth/logout');
      }
    }
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
      // eslint-disable-next-line no-param-reassign
      config.httpsAgent = agent;
    });
  }

  inject('serverApi', serverApi);
};

export default plugin;
