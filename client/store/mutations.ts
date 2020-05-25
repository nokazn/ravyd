/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';

import { RootState } from './state';

export type RootMutations = {
  SET_DOMINANT_BACKGROUND_COLOR: string | undefined
}

const mutations: Mutations<RootState, RootMutations> = {
  SET_DOMINANT_BACKGROUND_COLOR(state, color) {
    state.dominantBackgroundColor = color;
  },
};

export default mutations;
