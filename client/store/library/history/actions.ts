import { Actions } from 'typed-vuex';
import { LibraryHistoryState } from './state';
import { LibraryHistoryGetters } from './getters';
import { LibraryHistoryMutations } from './mutations';

export type LibraryHistoryActions = {
  getRecentlyPlayed: () => Promise<void>
}

export type RootActions = {
  'library/history/getRecentlyPlayed': LibraryHistoryActions['getRecentlyPlayed'];
}

const actions: Actions<
  LibraryHistoryState,
  LibraryHistoryActions,
  LibraryHistoryGetters,
  LibraryHistoryMutations
> = {
  async getRecentlyPlayed({ state, commit, dispatch }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    const recentlyPlayed = await this.$spotify.player.getRecentlyPlayed();

    const currentRecentluPlayed = state.recentlyPlayed;
    // 再生履歴を保持していて、再生履歴が取得できなかった場合はパス
    if (recentlyPlayed == null && currentRecentluPlayed != null) return;

    commit('SET_RECENTLY_PLAYED', recentlyPlayed);
  },
};

export default actions;
