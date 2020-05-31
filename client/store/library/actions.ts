import { Actions } from 'vuex';

import { convertPlaylistTrackDetail } from '~/scripts/converter/convertPlaylistTrackDetail';
import { LibraryState } from './state';
import { LibraryGetters } from './getters';
import { LibraryMutations } from './mutations';
import { App } from '~~/types';

export type LibraryActions = {
  getSavedTrackList: (payload?: { limit: number } | undefined) => Promise<void>
  saveTracks: (trackIdList: string[]) => Promise<void>
  removeTracks: (trackIdList: string[]) => Promise<void>
  modifyTrackSavedState: ({ trackId, isSaved }: {
    trackId: string
    isSaved: boolean
  }) => void
};

export type RootActions = {
  'library/getSavedTrackList': LibraryActions['getSavedTrackList']
  'library/saveTracks': LibraryActions['saveTracks']
  'library/removeTracks': LibraryActions['removeTracks']
  'library/modifyTrackSavedState': LibraryActions['modifyTrackSavedState']
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

    commit('ADD_TRACK_LIST', trackList);

    // limit 以下の個数が返ってきた場合、これをもってすべての曲が取得されたとする
    if (trackList.length < limit) {
      commit('SET_IS_FULL_TRACK_LIST', true);
    }
  },

  async saveTracks({ dispatch }, trackIdList) {
    await this.$spotify.library.saveTracks({ trackIdList });

    trackIdList.forEach((trackId) => {
      dispatch('modifyTrackSavedState', { trackId, isSaved: true });
    });
  },

  async removeTracks({ dispatch }, trackIdList) {
    await this.$spotify.library.removeUserSavedTracks({ trackIdList });

    trackIdList.forEach((trackId) => {
      dispatch('modifyTrackSavedState', { trackId, isSaved: false });
    });
  },

  async modifyTrackSavedState({ state, commit, dispatch }, { trackId, isSaved }) {
    const currentTrackList = state.trackList;
    if (currentTrackList == null) return;

    const modifyTrackSavedStateHandler = (
      list: App.PlaylistTrackDetail[],
      savedState: boolean,
    ) => list
      .map((item) => (item.id === trackId
        ? { ...item, isSaved: savedState }
        : item));

    const nextTrackList = modifyTrackSavedStateHandler(currentTrackList, isSaved);
    // ライブラリ一覧を更新
    commit('SET_TRACK_LIST', nextTrackList);
    // プレイヤーを更新
    dispatch('player/modifyTrackSavedState', { trackId, isSaved }, { root: true });

    const [actualIsSaved] = await this.$spotify.library.checkUserSavedTracks({
      trackIdList: [trackId],
    });
    // 実際の状態と異なれば戻す
    if (isSaved !== actualIsSaved) {
      // ライブラリ一覧を戻す
      commit('SET_TRACK_LIST', currentTrackList);
      // プレイヤーを戻す
      dispatch('player/modifyTrackSavedState', { trackId, isSaved: actualIsSaved }, { root: true });
    }
  },
};

export default actions;
