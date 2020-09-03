import { Actions } from 'typed-vuex';

import { convertTrackDetail } from '~/scripts/converter/convertTrackDetail';
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
  async getRecentlyPlayed({ commit, dispatch }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    const recentlyPlayed = await this.$spotify.player.getRecentlyPlayed({ limit: 50 });

    // 再生履歴が取得できなかった場合はパス
    if (recentlyPlayed == null) return;

    const trackIdList = recentlyPlayed.items.map((history) => history.track.id);
    const isTrackSavedList = await this.$spotify.library.checkUserSavedTracks({ trackIdList });
    const trackList = recentlyPlayed.items.map((history, i) => ({
      ...convertTrackDetail({ isTrackSavedList })(history.track, i),
      type: 'track' as const,
    }));

    commit('SET_RECENTLY_PLAYED', recentlyPlayed.items);
    commit('SET_TRACK_HISTORY_LIST', trackList);
    commit('SET_TOTAL', recentlyPlayed.total);
  },
};

export default actions;
