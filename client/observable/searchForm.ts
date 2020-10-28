import Vue from 'vue';
import { $overlay } from '~/observable/overlay';

const PORTAL_NAME = 'SEARCH_RESULT_LIST';

export type SearchFormState = {
  menu: boolean
  query: string
  isSearching: boolean
}

export type SearchForm = {
  readonly menu: boolean
  readonly query: string
  readonly isSearching: boolean
  readonly PORTAL_NAME: typeof PORTAL_NAME
  handleMenu: (menu: boolean) => void
  setQuery: (query: string) => void
  handleSearching: (isSearching: boolean) => void
}

const state = Vue.observable<SearchFormState>({
  menu: false,
  query: '',
  isSearching: false,
});

export const $searchForm: SearchForm = {
  get menu(): boolean {
    return state.menu;
  },

  get query(): string {
    return state.query;
  },

  get isSearching(): boolean {
    return state.isSearching;
  },

  get PORTAL_NAME(): typeof PORTAL_NAME {
    return PORTAL_NAME;
  },

  handleMenu(menu: boolean) {
    state.menu = menu;
    // メニュー表示時に overlay も表示
    $overlay.change(menu);
  },

  setQuery(query: string) {
    state.query = query;
  },

  handleSearching(isSearching: boolean) {
    state.isSearching = isSearching;
  },
};
