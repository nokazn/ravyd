import type { VuexGetters } from 'typed-vuex';
import type { SpotifyAPI } from 'shared/types';

import { getImageSrc } from '~/services/converter';
import type { State } from './types';

export type Getters = {
  accessToken: string | undefined;
  user: SpotifyAPI.User | undefined;
  isRefreshing: boolean;
  isLoggedIn: boolean;
  isPremium: boolean;
  isTokenExpired: () => boolean;
  finishedRefreshingToken: () => Promise<true>;
  userId: string | undefined;
  userDisplayName: string | undefined;
  userAvatarSrc: (avatarSize?: number) => string| undefined;
  userCountryCode: SpotifyAPI.Country | undefined;
};

const getters: VuexGetters<State, Getters> = {
  accessToken(state) {
    return state.accessToken;
  },

  user(state) {
    return state.user;
  },

  isRefreshing(state) {
    return state.isRefreshing;
  },

  isLoggedIn(state) {
    return state.authState != null
      && state.accessToken != null
      && state.user != null;
  },

  isPremium(state) {
    return state.user?.product === 'premium';
  },

  // 関数実行時に Date.now() が評価されるようにする
  isTokenExpired(state) {
    return () => (state.expirationMs != null
      ? Date.now() > state.expirationMs
      : false);
  },

  // 30秒経ったら強制的に解決させる
  finishedRefreshingToken(state) {
    return () => {
      const timeout = 30 * 1000;
      return state.isRefreshing
        ? new Promise((resolve) => setTimeout(() => resolve(true), timeout))
        : Promise.resolve(true);
    };
  },

  userId(state) {
    return state.user?.id;
  },

  userDisplayName(state) {
    return state.user?.display_name ?? state.user?.email;
  },

  userAvatarSrc(state) {
    return (avatarSize) => getImageSrc(state.user?.images, avatarSize);
  },

  userCountryCode(state) {
    return state.user?.country;
  },
};

export default getters;
