import { Actions } from 'vuex';

import { convertReleaseForCard } from '~/scripts/converter/convertReleaseForCard';
import { LibraryReleasesState } from './state';
import { LibraryReleasesGetters } from './getters';
import { LibraryReleasesMutations } from './mutations';
import { SpotifyAPI } from '~~/types';

export type LibraryReleasesActions = {
  getSavedReleaseList: (payload?: { limit: number } | undefined) => Promise<void>
  updateLatestSavedReleaseList: () => Promise<void>
  saveReleases: (albumIdList: string[]) => Promise<void>
  removeReleases: (albumIdList: string[]) => Promise<void>
  modifyReleaseSavedState: ({ releaseId, isSaved }: {
    releaseId: string
    isSaved: boolean
  }) => void
};

export type RootActions = {
  'library/releases/getSavedReleaseList': LibraryReleasesActions['getSavedReleaseList']
  'library/releases/updateLatestSavedReleaseList': LibraryReleasesActions['updateLatestSavedReleaseList']
  'library/releases/saveReleases': LibraryReleasesActions['saveReleases']
  'library/releases/removeReleases': LibraryReleasesActions['removeReleases']
  'library/releases/modifyReleaseSavedState': LibraryReleasesActions['modifyReleaseSavedState']
};

const MAX_ARTWORK_SIZE = 240;
const convertRelease = ({ album }: {
  album: SpotifyAPI.SimpleAlbum | SpotifyAPI.Album
}) => convertReleaseForCard(MAX_ARTWORK_SIZE)(album);

const actions: Actions<
  LibraryReleasesState,
  LibraryReleasesActions,
  LibraryReleasesGetters,
  LibraryReleasesMutations
> = {
  /**
   * 指定されない場合は limit: 30 で取得
   */
  async getSavedReleaseList({
    state, commit, getters, rootGetters,
  }, payload) {
    // すでに全データを取得している場合は何もしない
    if (state.isFullReleaseList) return;

    const limit = payload?.limit ?? 30;
    const market = rootGetters['auth/userCountryCode'];
    if (market == null) return;

    const offset = getters.releaseListLength + 1;
    const releases = await this.$spotify.library.getUserSavedAlbums({
      limit,
      offset,
      market,
    });
    if (releases == null) {
      commit('SET_RELEASE_LIST', null);
      commit('SET_IS_FULL_RELEASE_LIST', true);
      return;
    }

    const releaseList = releases.items.map(convertRelease);

    commit('ADD_TO_RELEASE_LIST', releaseList);

    if (releases.next == null) {
      commit('SET_IS_FULL_RELEASE_LIST', true);
    }
  },

  async updateLatestSavedReleaseList({ state, commit, rootGetters }) {
    const market = rootGetters['auth/userCountryCode'];
    if (market == null) return;

    // ライブラリの情報が更新されていないものの数
    const limit = state.numberOfUnupdatedReleases;
    if (limit === 0) return;

    const releases = await this.$spotify.library.getUserSavedAlbums({
      limit,
      market,
    });
    if (releases == null) {
      commit('SET_RELEASE_LIST', null);
      return;
    }

    const currentReleaseList = state.releaseList;
    if (currentReleaseList == null) {
      commit('SET_RELEASE_LIST', releases.items.map(convertRelease));
      return;
    }

    const currentLatestReleaseId = currentReleaseList[0].id;
    const lastReleaseIndex = releases.items
      .findIndex(({ album }) => album.id === currentLatestReleaseId);

    const addedReleaseList = lastReleaseIndex === -1
      ? releases.items.map(convertRelease)
      : releases.items.slice(0, lastReleaseIndex).map(convertRelease);

    commit('UNSHIFT_TO_RELEASE_LIST', addedReleaseList);
    commit('RESET_NUMBER_OF_UNUPDATED_RELEASES');
  },

  async saveReleases({ dispatch }, albumIdList) {
    await this.$spotify.library.saveAlbums({ albumIdList });

    albumIdList.forEach((releaseId) => {
      dispatch('modifyReleaseSavedState', {
        releaseId,
        isSaved: true,
      });
    });
  },

  async removeReleases({ dispatch }, albumIdList) {
    await this.$spotify.library.removeUserSavedAlbums({ albumIdList });

    albumIdList.forEach((releaseId) => {
      dispatch('modifyReleaseSavedState', {
        releaseId,
        isSaved: false,
      });
    });
  },

  async modifyReleaseSavedState({ state, commit }, { releaseId, isSaved }) {
    const currentReleaseList = state.releaseList;
    if (currentReleaseList == null) return;

    const savedReleaseIndex = currentReleaseList
      .findIndex((release) => release.id === releaseId);
    // ライブラリ一覧を更新
    if (savedReleaseIndex !== -1) {
      const nextReleaseList = [...currentReleaseList];
      // savedReleaseIndex から1個取り除く
      nextReleaseList.splice(savedReleaseIndex, 1);
      commit('SET_RELEASE_LIST', nextReleaseList);
    }

    const [actualIsSaved] = await this.$spotify.library.checkUserSavedAlbums({
      albumIdList: [releaseId],
    });

    commit('SET_ACTUAL_IS_SAVED', [releaseId, actualIsSaved]);

    // 実際の状態と異なれば戻す
    if (isSaved !== actualIsSaved) {
      // ライブラリ一覧を戻す
      commit('SET_RELEASE_LIST', currentReleaseList);
    }

    // ライブラリ一覧に表示されてないリリースを保存した場合
    if (isSaved && savedReleaseIndex === -1 && isSaved === actualIsSaved) {
      commit('INCREMENT_NUMBER_OF_UNUPDATED_RELEASES');
    }
  },
};

export default actions;
