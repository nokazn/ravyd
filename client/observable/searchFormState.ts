import Vue from 'vue';

export type SearchFormState = {
  query: string
  isFocused: boolean
  isMenuShown: boolean
}

export type SearchForm = {
  readonly query: string
  readonly isFocused: boolean
  readonly isMenuShown: boolean
  setQuery: (query: string) => void
  setIsFocused: (isFocused: boolean) => void
  handleMenu: (isMenuShown: boolean) => void
}

const state = Vue.observable<SearchFormState>({
  query: '',
  isFocused: false,
  isMenuShown: false,
});

export const $searchForm: SearchForm = {
  get query(): string {
    return state.query;
  },
  get isFocused(): boolean {
    return state.isFocused;
  },
  get isMenuShown(): boolean {
    return state.isFocused;
  },

  setQuery(query: string) {
    state.query = query;
    // テキストが入力されていたらメニューを表示
    if (query !== '') {
      state.isMenuShown = true;
    }
  },
  setIsFocused(isFocused: boolean) {
    state.isFocused = isFocused;
    // フォーカスしてテキストが入力されていたらメニューを表示
    if (isFocused && this.query !== '') {
      state.isMenuShown = true;
    }
  },
  handleMenu(isMenuShown: boolean) {
    state.isMenuShown = isMenuShown;
  },
};
