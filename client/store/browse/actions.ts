import { Actions } from 'vuex';
import { BrowseState } from './state';
import { BrowseGetters } from './getters';
import { BrowseMutations } from './mutations';
import { SpotifyAPI } from '~~/types';

export type BrowseActions = {
}

export type RootActions = {
}

const actions: Actions<BrowseState, BrowseActions, BrowseGetters, BrowseMutations> = {};

export default actions;
