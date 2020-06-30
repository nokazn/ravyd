import Vue from 'vue';

type Position = {
  top: number
  left: number
}

export type SearchFormState = {
  query: string
  isMenuShown: boolean
  position: Position
}

export type SearchForm = {
  readonly query: string
  readonly isMenuShown: boolean
  readonly position: Position
  setQuery: (query: string) => void
  setPosition: (top: number, left: number) => void
  handleMenu: (isMenuShown: boolean) => void
}

const state = Vue.observable<SearchFormState>({
  query: '',
  position: {
    top: 0,
    left: 0,
  },
  isMenuShown: false,
});

export const $searchForm: SearchForm = {
  get query(): string {
    return state.query;
  },
  get position(): Position {
    return state.position;
  },
  get isMenuShown(): boolean {
    return state.isMenuShown;
  },

  setQuery(query: string) {
    state.query = query;
  },
  setPosition(top: number, left: number) {
    state.position = { top, left };
  },
  handleMenu(isMenuShown: boolean) {
    state.isMenuShown = isMenuShown;
  },
};
