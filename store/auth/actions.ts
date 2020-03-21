import { ActionTree } from 'vuex';
import { RootState } from '@/store';
import { AuthState } from './state';

const actions: ActionTree<AuthState, RootState> = {
  async getUserData({ state, commit }): Promise<void> {
    if (state.token == null) return;

    const res = await this.$axios({
      url: 'https://api.spotify.com/v1/me',
      headers: {
        Authorization: `Bearer ${state.token.access_token}`,
      },
    }).catch((e) => {
      console.error(e);
      return null;
    });

    commit('setUserData', res?.data);
  },
};

export default actions;
