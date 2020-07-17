import { Getters } from 'vuex';

import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { AuthState } from './state';
import { SpotifyAPI } from '~~/types';

export type AuthGetters = {
  isLoggedin: boolean | undefined
  isTokenExpired: () => boolean
  userId: string | undefined
  userDisplayName: string | undefined
  userAvatarSrc: (avatarSize?: number) => string| undefined
  userCountryCode: SpotifyAPI.Country | undefined
}

export type RootGetters = {
  'auth/isLoggedin': AuthGetters['isLoggedin']
  'auth/isTokenExpired': AuthGetters['isTokenExpired']
  'auth/userId': AuthGetters['userId']
  'auth/userDisplayName': AuthGetters['userDisplayName']
  'auth/userAvatarSrc': AuthGetters['userAvatarSrc']
  'auth/userCountryCode': AuthGetters['userCountryCode']
}

const getters: Getters<AuthState, AuthGetters> = {
  isLoggedin(state) {
    return state.accessToken != null && state.userData != null;
  },

  // 関数実行時に Date.now() が評価されるようにするため
  isTokenExpired(state) {
    return () => (state.expireMillis != null
      ? Date.now() > state.expireMillis
      : false);
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
