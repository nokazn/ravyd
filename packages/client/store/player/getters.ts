import type { VuexGetters } from 'typed-vuex';
import type { State } from './types';

export type Getters = {
  playbackPlayer: Spotify.SpotifyPlayer | undefined;
  isPlayerConnected: boolean;
};

const playerGetters: VuexGetters<State, Getters> = {
  playbackPlayer(state) {
    return state.playbackPlayer;
  },

  isPlayerConnected(state) {
    return state.playbackPlayer != null;
  },
};

export default playerGetters;
