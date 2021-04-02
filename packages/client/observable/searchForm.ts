// import Vue from 'vue';

const PORTAL_NAME = 'SEARCH_RESULT_LIST';

export type SearchFormState = {
};

export type SearchForm = {
  readonly PORTAL_NAME: typeof PORTAL_NAME;
};

// const state = Vue.observable<SearchFormState>({
// });

export const $searchForm: SearchForm = {
  get PORTAL_NAME(): typeof PORTAL_NAME {
    return PORTAL_NAME;
  },
};
