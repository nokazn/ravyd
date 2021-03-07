/* eslint-disable no-param-reassign */
import type { VuexMutations } from 'typed-vuex';

import type { App } from '~/entities';
import type { State } from './types';

export type Mutations = {
  SET_DOMINANT_BACKGROUND_COLOR: App.DominantColor | undefined;
}

const mutations: VuexMutations<State, Mutations> = {
  SET_DOMINANT_BACKGROUND_COLOR(state, color) {
    state.dominantBackgroundColor = color;
  },
};

export default mutations;
