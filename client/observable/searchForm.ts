import Vue from 'vue';

const PORTAL_NAME = 'SEARCH_RESULT_LIST';

type Position = {
  top: number
  left: number
}

export type SearchFormState = {
  isMenuShown: boolean
  position: Position
  query: string
  isSearching: boolean
}

export type SearchForm = {
  readonly isMenuShown: boolean
  readonly position: Position
  readonly query: string
  readonly isSearching: boolean
  readonly PORTAL_NAME: typeof PORTAL_NAME
  handleMenu: (isMenuShown: boolean) => void
  setPosition: (top: number, left: number) => void
  setQuery: (query: string) => void
  handleSearching: (isSearching: boolean) => void
}

const state = Vue.observable<SearchFormState>({
  isMenuShown: false,
  position: {
    top: 0,
    left: 0,
  },
  query: '',
  isSearching: false,
});

export const $searchForm: SearchForm = {
  get isMenuShown(): boolean {
    return state.isMenuShown;
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

  handleMenu(isMenuShown: boolean) {
    state.isMenuShown = isMenuShown;
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
