/* eslint-disable no-param-reassign */
import https from 'https';
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { Plugin } from '@nuxt/types';

import { SPOTIFY_API_URL } from '~/constants';

const plugin: Plugin = ({ $axios, app }, inject) => {
  /**
   * Spotify API と通信する axios インスタンス
   */
  const spotifyApi = $axios.create({
    baseURL: SPOTIFY_API_URL,
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

  spotifyApi.onResponseError((err) => {
    // 認可リクエストによるエラーだった場合はアクセストークンを更新
    if (err.response?.status === 401) {
      app.$dispatch('auth/refreshAccessToken');
    }

    throw new Error(err.message);
  });

  inject('spotifyApi', spotifyApi);

  /**
   * serverMiddleware と通信する axios インスタンス
   */
  const serverApi = $axios.create({
    baseURL: `${process.env.BASE_URL}/api/v1`,
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
