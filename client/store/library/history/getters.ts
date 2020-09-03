import { Getters } from 'typed-vuex';

import { LibraryHistoryState } from './state';

export type LibraryHistoryGetters = {
  historyLength: number
  hasNext: boolean
}

export type RootGetters = {
  'library/history/historyLength': LibraryHistoryGetters['historyLength']
  'library/history/hasNext': LibraryHistoryGetters['hasNext']
}

const libraryHistoryGetters: Getters<LibraryHistoryState, LibraryHistoryGetters> = {
  historyLength(state) {
    return state.recentlyPlayed?.length ?? 0;
  },

  hasNext(state, getters) {
    return state.total != null
      ? getters.historyLength >= state.total
      : false;
  },
};

export default libraryHistoryGetters;
