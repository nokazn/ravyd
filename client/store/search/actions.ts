import { Actions } from 'vuex';
import { SearchState } from './state';
import { SearchGetters } from './getters';
import { SearchMutations } from './mutations';

export type SearchActions = {
}

export type RootActions = {
}

const actions: Actions<SearchState, SearchActions, SearchGetters, SearchMutations> = {};

export default actions;
