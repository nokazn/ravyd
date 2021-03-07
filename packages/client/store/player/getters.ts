import type { VuexGetters } from 'typed-vuex';
import type { State } from './types';

export type Getters = {
  isPlayerConnected: boolean
}

const playerGetters: VuexGetters<State, Getters> = {
  isPlayerConnected(state) {
    return state.playbackPlayer != null;
  },
};

export default playerGetters;
