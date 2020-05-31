import { Getters } from 'vuex';

import { AuthState } from './state';
import { SpotifyAPI } from '~~/types';

export type AuthGetters = {
  isLoggedin: boolean | null
  userDisplayName: string | null
  userAvatarSrc: string| null
  userCountryCode: SpotifyAPI.Country | undefined
}

export type RootGetters = {
  'auth/isLoggedin': AuthGetters['isLoggedin']
  'auth/userDisplayName': AuthGetters['userDisplayName']
  'auth/userAvatarSrc': AuthGetters['userAvatarSrc']
  'auth/userCountryCode': AuthGetters['userCountryCode']
}

const getters: Getters<AuthState, AuthGetters> = {
  isLoggedin(state) {
    return state.userData != null;
  },

  userDisplayName(state: AuthState) {
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
