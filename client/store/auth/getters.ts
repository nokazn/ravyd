import { Getters } from 'typed-vuex';

import { getImageSrc } from '~/utils/image';
import { AuthState } from './state';
import { SpotifyAPI } from '~~/types';

export type AuthGetters = {
  isLoggedin: boolean
  isPremium: boolean
  isTokenExpired: () => boolean
  finishedRefreshingToken: () => Promise<true>
  userId: string | undefined
  userDisplayName: string | undefined
  userAvatarSrc: (avatarSize?: number) => string| undefined
  userCountryCode: SpotifyAPI.Country | undefined
}

export type RootGetters = {
  'auth/isLoggedin': AuthGetters['isLoggedin']
  'auth/isPremium': AuthGetters['isPremium']
  'auth/isTokenExpired': AuthGetters['isTokenExpired']
  'auth/finishedRefreshingToken': AuthGetters['finishedRefreshingToken']
  'auth/userId': AuthGetters['userId']
  'auth/userDisplayName': AuthGetters['userDisplayName']
  'auth/userAvatarSrc': AuthGetters['userAvatarSrc']
  'auth/userCountryCode': AuthGetters['userCountryCode']
}

const getters: Getters<AuthState, AuthGetters> = {
  isLoggedin(state) {
    return state.accessToken != null && state.userData != null;
  },

  isPremium(state) {
    return state.userData?.product === 'premium';
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
    return state.userData?.id;
  },

  userDisplayName(state) {
    return state.userData?.display_name ?? state.userData?.email;
  },

  userAvatarSrc(state) {
    return (avatarSize) => getImageSrc(state.userData?.images, avatarSize);
  },

  userCountryCode(state) {
    return state.userData?.country;
  },
};

export default getters;
