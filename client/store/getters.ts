import { Getters } from 'typed-vuex';

import { BACKGROUND_COLOR, DARKEN_FILTER_RATIO, HEADER_BACKGROUND_COLOR_RGB } from '~/variables';
import { RootState } from './state';
import { App } from '~~/types';

export type RootGetters = {
  backgroundStyles: (height: number) => { background: string } | undefined
  headerStyles: { backgroundColor: string } | undefined
}

const getters: Getters<RootState, RootGetters> = {
  backgroundStyles(state) {
    return (gradationHeight: number) => {
      const rgb = state.dominantBackgroundColor?.rgb
        .map((color) => color * DARKEN_FILTER_RATIO)
        .join(',');

      return rgb != null
        ? { background: `linear-gradient(to bottom, rgb(${rgb}) 80px, ${BACKGROUND_COLOR} ${gradationHeight}px)` }
        : undefined;
    };
  },

  headerStyles(state) {
    const opacity = 0.6;
    const rgbList = state.dominantBackgroundColor?.rgb
      ?.map((color) => color * DARKEN_FILTER_RATIO) as App.DominantColorInfo['rgb'] ?? HEADER_BACKGROUND_COLOR_RGB;

    return { backgroundColor: `rgba(${rgbList.join(',')},${opacity})` };
  },
};

export default getters;
