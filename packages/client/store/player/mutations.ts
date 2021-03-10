/* eslint-disable no-param-reassign */
import type { VuexMutations } from 'typed-vuex';
import type { State } from './types';

export type Mutations = {
  SET_PLAYBACK_PLAYER: Spotify.SpotifyPlayer | undefined;
};

const mutations: VuexMutations<State, Mutations> = {
  SET_PLAYBACK_PLAYER(state, playbackPlayer) {
    state.playbackPlayer = playbackPlayer;
  },
};

export default mutations;
