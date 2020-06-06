import { Plugin } from '@nuxt/types';
import { NuxtAxiosInstance } from '@nuxtjs/axios';

const plugin: Plugin = ({ $axios, app }, inject) => {
  const spotifyApi = $axios.create({
    baseURL: process.env.spotifyUrl,
  }) as NuxtAxiosInstance;

  spotifyApi.onRequest((config) => {
    const accessToken = app.$state().auth.accessToken ?? '';
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

  const serverApi = $axios.create({
    baseURL: process.env.baseUrl,
    withCredentials: true,
  });

  inject('serverApi', serverApi);
};

export default plugin;
