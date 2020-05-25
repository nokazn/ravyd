/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';

import { RootState } from './state';
import { BACKGROUND_COLOR } from '~/variables';

export type RootMutations = {
  SET_DOMINANT_BACKGROUND_COLOR: string | undefined
}

const mutations: Mutations<RootState, RootMutations> = {
  SET_DOMINANT_BACKGROUND_COLOR(state, color) {
    state.dominantBackgroundColor = color ?? BACKGROUND_COLOR;
  },
};

export default mutations;
