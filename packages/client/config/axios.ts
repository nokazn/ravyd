import type { AxiosOptions } from '@nuxtjs/axios';
import { CLIENT_ORIGIN, SPOTIFY_API_URL, IS_DEVELOPMENT } from './constants';

export const axios: AxiosOptions = {
  baseURL: CLIENT_ORIGIN,
  browserBaseURL: SPOTIFY_API_URL,
  progress: false,
  proxy: true,
  proxyHeaders: true,
  retry: true,
  debug: IS_DEVELOPMENT,
  headers: {
    common: {
      Accept: 'application/json',
    },
  },
};
