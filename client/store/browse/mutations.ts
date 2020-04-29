/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { BrowseState } from './state';
import { SpotifyAPI } from '~~/types';

export type BrowseMutations = {
  SET_NEW_RELEASES: SpotifyAPI.Browse.NewReleases | null
}

export type RootMutations = {
  'browse/SET_NEW_RELEASES': BrowseMutations['SET_NEW_RELEASES']
}

const mutations: Mutations<BrowseState, BrowseMutations> = {
  SET_NEW_RELEASES(state, newReleases) {
    state.newReleases = newReleases;
  },
};

export default mutations;
