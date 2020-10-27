import Vue from 'vue';
import { $overlay } from '~/observable/overlay';

const PORTAL_NAME = 'SEARCH_RESULT_LIST';

type Position = {
  top: number
  left: number
}

export type SearchFormState = {
  menu: boolean
  position: Position
  query: string
  isSearching: boolean
}

export type SearchForm = {
  readonly menu: boolean
  readonly position: Position
  readonly query: string
  readonly isSearching: boolean
  readonly PORTAL_NAME: typeof PORTAL_NAME
  handleMenu: (menu: boolean) => void
  setPosition: (top: number, left: number) => void
  setQuery: (query: string) => void
  handleSearching: (isSearching: boolean) => void
}

const state = Vue.observable<SearchFormState>({
  menu: false,
  position: {
    top: 0,
    left: 0,
  },
  query: '',
  isSearching: false,
});

export const $searchForm: SearchForm = {
  get menu(): boolean {
    return state.menu;
  },

  get position(): Position {
    return state.position;
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

  setPosition(top: number, left: number) {
    state.position = { top, left };
  },

  setQuery(query: string) {
    state.query = query;
  },

  handleSearching(isSearching: boolean) {
    state.isSearching = isSearching;
  },
};
