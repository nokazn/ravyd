import { Actions } from 'vuex';

import { extractDominantColors } from '~/scripts/images/extractDominantColors';
import { DEFAULT_DOMINANT_COLOR } from '~/variables';
import { RootState } from './state';
import { RootGetters } from './getters';
import { RootMutations } from './mutations';

export type RootActions = {
  extractDominantBackgroundColor: (src: string) => Promise<void>
  setDefaultDominantBackgroundColor: () => void
  resetDominantBackgroundColor: () => void
}

const actions: Actions<RootState, RootActions, RootGetters, RootMutations> = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('auth/getAccessToken', undefined, { root: true });
    await dispatch('auth/getUserData', undefined, { root: true });
  },

  async extractDominantBackgroundColor({ commit }, src) {
    const colors = await extractDominantColors(src);

    commit('SET_DOMINANT_BACKGROUND_COLOR', colors?.Muted, { root: true });
  },
  setDefaultDominantBackgroundColor({ commit }) {
    commit('SET_DOMINANT_BACKGROUND_COLOR', DEFAULT_DOMINANT_COLOR, { root: true });
  },

  resetDominantBackgroundColor({ commit }) {
    commit('SET_DOMINANT_BACKGROUND_COLOR', undefined, { root: true });
  },
};

export default actions;
