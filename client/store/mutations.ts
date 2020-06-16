/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';

import { App } from '~~/types';
import { RootState } from './state';

export type RootMutations = {
  SET_DOMINANT_BACKGROUND_COLOR: App.DominantColorInfo | undefined
}

const mutations: Mutations<RootState, RootMutations> = {
  SET_DOMINANT_BACKGROUND_COLOR(state, color) {
    state.dominantBackgroundColor = color;
  },
};

export default mutations;
