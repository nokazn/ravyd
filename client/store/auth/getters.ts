import { Getters } from 'vuex';
import { AuthState } from './state';

export type AuthGetters = {
  isLoggedin: boolean | null
  userDisplayName: string | null
  userAvatarSrc: string| null
}

export type RootGetters = {
  'auth/isLoggedin': AuthGetters['isLoggedin']
  'auth/userDisplayName': AuthGetters['userDisplayName']
  'auth/userAvatarSrc': AuthGetters['userAvatarSrc']
}

const getters: Getters<AuthState, AuthGetters> = {
  isLoggedin(state) {
    return state.userData != null;
  },

  userDisplayName(state: AuthState) {
    return state.userData?.display_name ?? state.userData?.email ?? null;
  },

  userAvatarSrc(state) {
    return state.userData?.images[0]?.url ?? null;
  },
};

export default getters;
