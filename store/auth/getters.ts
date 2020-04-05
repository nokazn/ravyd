import { Getters } from 'vuex';
import { AuthState } from './state';

export type AuthGetters = {
  isLoggedin: boolean | null
}

export type RootGetters = {
  'auth/isLoggedin': AuthGetters['isLoggedin']
}

const getters: Getters<AuthState, AuthGetters> = {
  isLoggedin(state) {
    return state.userData === undefined
      ? null
      : state.userData != null;
  },
};

export default getters;
