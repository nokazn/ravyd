import { Actions } from 'vuex';

import { convertPlaylistTrackDetail } from '~/scripts/converter/convertPlaylistTrackDetail';
import { LibraryState } from './state';
import { LibraryGetters } from './getters';
import { LibraryMutations } from './mutations';

export type LibraryActions = {
  getSavedTrackList: (payload?: { limit: number } | undefined) => Promise<void>
  saveTracks: (trackIdList: string[]) => Promise<void>
  removeTracks: (trackIdList: string[]) => Promise<void>
};

export type RootActions = {
  'library/getSavedTrackList': LibraryActions['getSavedTrackList']
  'library/saveTracks': LibraryActions['saveTracks']
  'library/removeTracks': LibraryActions['removeTracks']
};

const actions: Actions<LibraryState, LibraryActions, LibraryGetters, LibraryMutations> = {
  /**
   * 指定されない場合は limit: 30 で取得
   */
  async getSavedTrackList({
    state, commit, getters, rootGetters,
  }, payload) {
    // すでに全楽曲を指定している場合は何もしない
    if (state.isFullTrackList) return;

    const limit = payload?.limit ?? 30;
    const market = rootGetters['auth/userCountryCode'];
    if (market == null) return;

    const offset = getters.trackListLength + 1;
    const tracks = await this.$spotify.library.getUserSavedTracks({
      limit,
      offset,
      market,
    });
    if (tracks == null) {
      commit('SET_TRACK_LIST', null);
      return;
    }

    // 保存された楽曲を取得しているので isSaved はすべて true
    const isTrackSavedList = new Array(tracks.items.length).fill(true);
    const trackList = tracks.items
      .map(convertPlaylistTrackDetail({ isTrackSavedList }));

    commit('SET_TRACK_LIST', trackList);

    // limit 以下の個数が返ってきた場合、これをもってすべての曲が取得されたとする
    if (trackList.length < limit) {
      commit('SET_IS_FULL_TRACK_LIST', true);
    }
  },

  async saveTracks({ dispatch, rootState }, trackIdList) {
    await this.$spotify.library.saveTracks({ trackIdList });

    const isCurrentTrackSavedStateChanged = rootState.player.trackId != null
      && trackIdList.includes(rootState.player.trackId);
    if (isCurrentTrackSavedStateChanged) {
      dispatch('player/checkSavedTracks', undefined, { root: true });
    }
  },

  async removeTracks({ dispatch, rootState }, trackIdList) {
    await this.$spotify.library.removeUserSavedTracks({ trackIdList });

    const isCurrentTrackSavedStateChanged = rootState.player.trackId != null
      && trackIdList.includes(rootState.player.trackId);
    if (isCurrentTrackSavedStateChanged) {
      dispatch('player/checkSavedTracks', undefined, { root: true });
    }
  },
};

export default actions;
