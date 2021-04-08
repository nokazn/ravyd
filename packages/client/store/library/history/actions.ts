import type { VuexActions } from 'typed-vuex';

import { convertTrackDetail } from '~/services/converter';
import type { State, Mutations, Getters } from './types';

interface ModifyTrackSavedStateParams {
  trackId: string;
  isSaved: boolean;
}

export type Actions = {
  getRecentlyPlayed: () => Promise<void>;
  modifyTrackSavedState: (params: ModifyTrackSavedStateParams) => void;
};

const actions: VuexActions<State, Actions, Getters, Mutations> = {
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
  },

  modifyTrackSavedState({ state, commit }, { trackId, isSaved }) {
    // TODO: コピーしないと表示に反映されない
    const trackList = [...state.historyList];
    const savedTrackIndex = trackList.findIndex((track) => track.id === trackId);
    // ライブラリに存在する場合、削除したリリースは削除し、保存したリリースは再度先頭にするためにライブラリからは一度削除
    if (savedTrackIndex !== -1) {
      trackList[savedTrackIndex] = {
        ...trackList[savedTrackIndex],
        isSaved,
      };
      commit('SET_TRACK_HISTORY_LIST', trackList);
    }
  },
};

export default actions;
