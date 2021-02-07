/* eslint-disable no-param-reassign */
import { Mutations } from 'typed-vuex';

import type { App } from '~/entities';
import type { RootState } from './state';

export type RootMutations = {
  SET_DOMINANT_BACKGROUND_COLOR: App.DominantColor | undefined;
}

const mutations: Mutations<RootState, RootMutations> = {
  SET_DOMINANT_BACKGROUND_COLOR(state, color) {
    state.dominantBackgroundColor = color;
  },
};

export default mutations;
