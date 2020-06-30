import Vue from 'vue';

type Position = {
  top: number
  left: number
}

export type SearchFormState = {
  isMenuShown: boolean
  position: Position
}

export type SearchForm = {
  readonly isMenuShown: boolean
  readonly position: Position
  setPosition: (top: number, left: number) => void
  handleMenu: (isMenuShown: boolean) => void
}

const state = Vue.observable<SearchFormState>({
  position: {
    top: 0,
    left: 0,
  },
  isMenuShown: false,
});

export const $searchForm: SearchForm = {
  get position(): Position {
    return state.position;
  },
  get isMenuShown(): boolean {
    return state.isMenuShown;
  },

  setPosition(top: number, left: number) {
    state.position = { top, left };
  },
  handleMenu(isMenuShown: boolean) {
    state.isMenuShown = isMenuShown;
  },
};
