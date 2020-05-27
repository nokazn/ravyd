import { Actions } from 'vuex';

import { extractDominantColors } from '~/scripts/images/extractDominantColors';
import { RootState } from './state';
import { RootGetters } from './getters';
import { RootMutations } from './mutations';

export type RootActions = {
  extractDominantBackgroudColor: (src: string) => Promise<void>
}

const actions: Actions<RootState, RootActions, RootGetters, RootMutations> = {
  async extractDominantBackgroudColor({ commit }, src) {
    const colors = await extractDominantColors(src);
    const backgroundPallet = colors?.DarkMuted;

    commit('SET_DOMINANT_BACKGROUND_COLOR', backgroundPallet, { root: true });
  },
};

export default actions;
