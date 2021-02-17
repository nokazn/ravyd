/* eslint-disable no-param-reassign */
import type { Mutations } from 'typed-vuex';
import type { PlayerState } from './state';

export type PlayerMutations = {
  SET_PLAYBACK_PLAYER: Spotify.SpotifyPlayer | undefined
};

export type RootMutations = {
  'player/SET_PLAYBACK_PLAYER': PlayerMutations['SET_PLAYBACK_PLAYER']
};

const mutations: Mutations<PlayerState, PlayerMutations> = {
  SET_PLAYBACK_PLAYER(state, playbackPlayer) {
    state.playbackPlayer = playbackPlayer;
  },
};

export default mutations;
