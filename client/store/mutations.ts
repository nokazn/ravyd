/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { Swatch } from 'node-vibrant/lib/color';

import { RootState } from './state';

export type RootMutations = {
  SET_DOMINANT_BACKGROUND_COLOR: Swatch | undefined
}

const mutations: Mutations<RootState, RootMutations> = {
  SET_DOMINANT_BACKGROUND_COLOR(state, color) {
    state.dominantBackgroundColor = color;
  },
};

export default mutations;
