/* eslint-disable no-param-reassign */
import { Mutations } from 'typed-vuex';

import { App } from '~~/types';
import { RootState } from './state';

export type RootMutations = {
  SET_DOMINANT_BACKGROUND_COLOR: App.DominantColor | undefined;
}

const mutations: Mutations<RootState, RootMutations> = {
  SET_DOMINANT_BACKGROUND_COLOR(state, color) {
    state.dominantBackgroundColor = color;
  },
};

export default mutations;
