import { Getters } from 'vuex';

import { BACKGROUND_COLOR, DARKEN_FILTER_RATIO } from '~/variables';
import { RootState } from './state';

export type RootGetters = {
  backgroundStyles: { background: string } | undefined
}

const getters: Getters<RootState, RootGetters> = {
  backgroundStyles(state) {
    const gradationHeight = 320;
    const rgb = state.dominantBackgroundColor?.rgb
      .map((color) => color * DARKEN_FILTER_RATIO)
      .join(',');

    return rgb != null
      ? { background: `linear-gradient(to bottom, rgb(${rgb}) 80px, ${BACKGROUND_COLOR} ${gradationHeight}px)` }
      : undefined;
  },
};

export default getters;
