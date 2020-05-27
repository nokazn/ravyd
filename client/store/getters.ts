import { Getters } from 'vuex';

import { BACKGROUND_COLOR } from '~/variables';
import { RootState } from './state';

export type RootGetters = {
  backgroundStyles: { background: string } | undefined
}

const getters: Getters<RootState, RootGetters> = {
  backgroundStyles(state) {
    const gradationHeight = 250;
    const color = state.dominantBackgroundColor?.hex;
    return color != null
      ? { background: `linear-gradient(to bottom, ${color} 80px, ${BACKGROUND_COLOR} ${gradationHeight}px)` }
      : undefined;
  },
};

export default getters;
