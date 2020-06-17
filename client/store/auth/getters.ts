import { Getters } from 'vuex';

import { AuthState } from './state';
import { SpotifyAPI } from '~~/types';

export type AuthGetters = {
  isLoggedin: boolean | null
  isTokenExpired: () => boolean
  userId: string | undefined
  userDisplayName: string | null
  userAvatarSrc: string| null
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

  isTokenExpired(state) {
    return () => (state.expireMillis != null
      ? Date.now() > state.expireMillis
      : false);
  },

  userId(state) {
    return state.userData?.id;
  },

  userDisplayName(state) {
    return state.userData?.display_name ?? state.userData?.email ?? null;
  },

  userAvatarSrc(state) {
    return state.userData?.images != null
      ? state.userData?.images[0]?.url ?? null
      : null;
  },

  userCountryCode(state) {
    return state.userData?.country;
  },
};

export default getters;
