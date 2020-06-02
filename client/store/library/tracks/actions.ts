import { Actions } from 'vuex';

import { convertPlaylistTrackDetail } from '~/scripts/converter/convertPlaylistTrackDetail';
import { LibraryTracksState } from './state';
import { LibraryTracksGetters } from './getters';
import { LibraryTracksMutations } from './mutations';

export type LibraryTracksActions = {
  getSavedTrackList: (payload?: { limit: number } | undefined) => Promise<void>
  updateLatestSavedTrackList: () => Promise<void>
  removeUnsavedTracks: () => void
  saveTracks: (trackIdList: string[]) => Promise<void>
  removeTracks: (trackIdList: string[]) => Promise<void>
  modifyTrackSavedState: ({ trackId, isSaved }: {
    trackId: string
    isSaved: boolean
  }) => void
};

export type RootActions = {
  'library/tracks/getSavedTrackList': LibraryTracksActions['getSavedTrackList']
  'library/tracks/updateLatestSavedTrackList': LibraryTracksActions['updateLatestSavedTrackList']
  'library/tracks/removeUnsavedTracks': LibraryTracksActions['removeUnsavedTracks']
  'library/tracks/saveTracks': LibraryTracksActions['saveTracks']
  'library/tracks/removeTracks': LibraryTracksActions['removeTracks']
  'library/tracks/modifyTrackSavedState': LibraryTracksActions['modifyTrackSavedState']
};

const actions: Actions<
  LibraryTracksState,
  LibraryTracksActions,
  LibraryTracksGetters,
  LibraryTracksMutations
> = {
  /**
   * 指定されない場合は limit: 30 で取得
   */
  async getSavedTrackList({
    state, commit, getters, rootGetters,
  }, payload) {
    // すでに全データを取得している場合は何もしない
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

    commit('ADD_TO_TRACK_LIST', trackList);

    // limit 以下の個数が返ってきた場合、これをもって全データが取得されたとする
    if (trackList.length < limit) {
      commit('SET_IS_FULL_TRACK_LIST', true);
    }
  },

  async updateLatestSavedTrackList({ state, commit, rootGetters }) {
    const market = rootGetters['auth/userCountryCode'];
    if (market == null) return;

    // ライブラリの情報が更新されていないものの数
    const limit = state.numberOfUnupdatedTracks;
    if (limit === 0) return;

    const tracks = await this.$spotify.library.getUserSavedTracks({
      limit,
      market,
    });
    if (tracks == null) {
      commit('SET_TRACK_LIST', null);
      return;
    }

    // 保存された楽曲を取得しているので isSaved はすべて true
    const isTrackSavedList = new Array(tracks.items.length).fill(true);

    const currentTrackList = state.trackList;
    if (currentTrackList == null) {
      commit('SET_TRACK_LIST', tracks.items.map(
        convertPlaylistTrackDetail({ isTrackSavedList }),
      ));
      return;
    }

    const currentLatestTrackId = currentTrackList[0].id;
    const lastTrackIndex = tracks.items
      .findIndex(({ track }) => track.id === currentLatestTrackId);

    // @todo
    const addedTrackList = lastTrackIndex === -1
      ? tracks.items
        .map(convertPlaylistTrackDetail({ isTrackSavedList }))
      : tracks.items
        .slice(0, lastTrackIndex)
        .map(convertPlaylistTrackDetail({ isTrackSavedList }));
    commit('UNSHIFT_TO_TRACK_LIST', addedTrackList);
    commit('RESET_NUMBER_OF_UNUPDATED_TRACKS');
  },

  removeUnsavedTracks({ state, commit }) {
    const { trackList } = state;
    if (trackList == null) return;

    const filteredTrackList = trackList.filter((track) => track.isSaved);
    commit('SET_TRACK_LIST', filteredTrackList);
  },

  async saveTracks({ dispatch }, trackIdList) {
    await this.$spotify.library.saveTracks({ trackIdList });

    trackIdList.forEach((trackId) => {
      dispatch('modifyTrackSavedState', {
        trackId,
        isSaved: true,
      });
    });
  },

  async removeTracks({ dispatch }, trackIdList) {
    await this.$spotify.library.removeUserSavedTracks({ trackIdList });

    trackIdList.forEach((trackId) => {
      dispatch('modifyTrackSavedState', {
        trackId,
        isSaved: false,
      });
    });
  },

  async modifyTrackSavedState({ state, commit, dispatch }, { trackId, isSaved }) {
    const currentTrackList = state.trackList;
    if (currentTrackList == null) return;

    const savedTrackIndex = currentTrackList.findIndex((track) => track.id === trackId);
    // ライブラリ一覧を更新
    if (savedTrackIndex !== -1) {
      const nextTrackList = [...currentTrackList];
      nextTrackList[savedTrackIndex] = {
        ...currentTrackList[savedTrackIndex],
        isSaved,
      };
      commit('SET_TRACK_LIST', nextTrackList);
    }

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

    // ライブラリ一覧に表示されてない曲を保存した場合
    if (isSaved && savedTrackIndex === -1 && isSaved === actualIsSaved) {
      commit('INCREMENT_NUMBER_OF_UNUPDATED_TRACKS');
    }
  },
};

export default actions;
