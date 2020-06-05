import { Actions } from 'vuex';

import { extractDominantColors } from '~/scripts/images/extractDominantColors';
import { RootState } from './state';
import { RootGetters } from './getters';
import { RootMutations } from './mutations';

export type RootActions = {
  extractDominantBackgroundColor: (src: string) => Promise<void>
  resetBackgroundColor: () => void
}

const actions: Actions<RootState, RootActions, RootGetters, RootMutations> = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('auth/getAccessToken', undefined, { root: true });
    await dispatch('auth/getUserData', undefined, { root: true });
  },

  async extractDominantBackgroundColor({ commit }, src) {
    const colors = await extractDominantColors(src);
    const backgroundPallet = colors?.DarkMuted;

    commit('SET_DOMINANT_BACKGROUND_COLOR', backgroundPallet, { root: true });
  },

  resetBackgroundColor({ commit }) {
    commit('SET_DOMINANT_BACKGROUND_COLOR', undefined, { root: true });
  },
};

export default actions;
