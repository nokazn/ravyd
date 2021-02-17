import type { Getters } from 'typed-vuex';
import type { PlayerState } from './state';

export type PlayerGetters = {
  isPlayerConnected: boolean
}

export type RootGetters = {
  'player/isPlayerConnected': PlayerGetters['isPlayerConnected']
}

const playerGetters: Getters<PlayerState, PlayerGetters> = {
  isPlayerConnected(state) {
    return state.playbackPlayer != null;
  },
};

export default playerGetters;
