import { Getters } from 'vuex';

import { BACKGROUND_COLOR, DEFAULT_DOMINANT_COLOR } from '~/variables';
import { RootState } from './state';

export type RootGetters = {
  backgroundStyles: { background: string }
}

const getters: Getters<RootState, RootGetters> = {
  backgroundStyles(state) {
    const gradationHeight = 300;
    const color = state.dominantBackgroundColor?.hex ?? DEFAULT_DOMINANT_COLOR;
    return { background: `linear-gradient(to bottom, ${color} 80px, ${BACKGROUND_COLOR} ${gradationHeight}px)` };
  },
};

export default getters;
