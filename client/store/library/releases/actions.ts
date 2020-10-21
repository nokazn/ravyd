import { Actions } from 'typed-vuex';

import { convertReleaseForCard } from '~/utils/converter';
import { LibraryReleasesState } from './state';
import { LibraryReleasesGetters } from './getters';
import { LibraryReleasesMutations } from './mutations';
import { EMPTY_PAGING } from '~/constants';
import { SpotifyAPI, OneToFifty } from '~~/types';
import { multipleRequests } from '~/utils/request/multipleRequests';

export type LibraryReleasesActions = {
  getSavedReleaseList: (payload?: { limit: OneToFifty } | undefined) => Promise<void>
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

const convertRelease = ({ album }: {
  album: SpotifyAPI.SimpleAlbum | SpotifyAPI.Album
}) => convertReleaseForCard(album);

const actions: Actions<
  LibraryReleasesState,
  LibraryReleasesActions,
  LibraryReleasesGetters,
  LibraryReleasesMutations
> = {
  /**
   * 保存済みのリリースを取得
   * 指定されない場合は limit: 30 で取得
   */
  async getSavedReleaseList({
    getters,
    commit,
    dispatch,
    rootGetters,
  }, payload) {
    // すでに全データを取得している場合は何もしない
    if (getters.isFull) return;

    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    const limit = payload?.limit ?? 30;
    const offset = getters.releaseListLength;
    const market = rootGetters['auth/userCountryCode'];
    const releases = await this.$spotify.library.getUserSavedAlbums({
      limit,
      offset,
      market,
    });
    if (releases == null) {
      this.$toast.pushError('お気に入りのアルバムの一覧を取得できませんでした。');
      return;
    }

    const releaseList = releases.items.map(convertRelease);
    commit('ADD_TO_RELEASE_LIST', releaseList);
    commit('SET_TOTAL', releases.total);
  },

  /**
   * 未更新のリリースを追加
   */
  async updateLatestSavedReleaseList({
    state,
    commit,
    dispatch,
    rootGetters,
  }) {
    type LibraryOfReleases = SpotifyAPI.LibraryOf<'album'>;
    // ライブラリの情報が更新されていないものの数
    const {
      unupdatedCounts,
      releaseList: currentReleaseList,
    } = state;
    if (unupdatedCounts === 0) return;

    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    const maxLimit = 50;
    // 最大値は50
    const limit = Math.min(unupdatedCounts, maxLimit) as OneToFifty;
    const market = rootGetters['auth/userCountryCode'];
    const handler = (index: number): Promise<LibraryOfReleases | undefined> => {
      const offset = limit * index;
      return this.$spotify.library.getUserSavedAlbums({
        limit,
        offset,
        market,
      });
    };

    const releases: LibraryOfReleases | undefined = await multipleRequests(
      handler,
      unupdatedCounts,
      maxLimit,
    ).then((pagings) => pagings.reduce((prev, curr) => {
      // 1つでもリクエストが失敗したらすべて無効にする
      if (prev == null || curr == null) return undefined;
      return {
        ...curr,
        items: [...prev.items, ...curr.items],
      };
    }, EMPTY_PAGING as LibraryOfReleases));

    if (releases == null) {
      this.$toast.pushError('お気に入りのアルバムの一覧を更新できませんでした。');
      return;
    }

    // @todo lastRelease の位置まで取得すべき?
    // 現在のライブラリの先頭があるかどうか
    const currentLatestReleaseId = currentReleaseList[0].id;
    const lastReleaseIndex = releases.items
      .findIndex(({ album }) => album.id === currentLatestReleaseId);

    const addedReleaseList = lastReleaseIndex === -1
      ? releases.items.map(convertRelease)
      : releases.items.slice(0, lastReleaseIndex).map(convertRelease);

    commit('UNSHIFT_TO_RELEASE_LIST', addedReleaseList);
    commit('SET_TOTAL', releases.total);
    commit('RESET_UNUPDATED_COUNTS');
  },

  /**
   * リリースを保存
   */
  async saveReleases({ dispatch }, albumIdList) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    await this.$spotify.library.saveAlbums({ albumIdList })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.pushError('ライブラリにアルバムを保存できませんでした。');
      });

    albumIdList.forEach((releaseId) => {
      dispatch('modifyReleaseSavedState', {
        releaseId,
        isSaved: true,
      });
    });
  },

  /**
   * 保存済のリリースを取得
   */
  async removeReleases({ dispatch }, albumIdList) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    await this.$spotify.library.removeUserSavedAlbums({ albumIdList })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.pushError('ライブラリからアルバムを削除できませんでした。');
      });

    albumIdList.forEach((releaseId) => {
      dispatch('modifyReleaseSavedState', {
        releaseId,
        isSaved: false,
      });
    });
  },

  /**
   * saveReleases, removeReleases から呼ばれる
   */
  modifyReleaseSavedState({ state, commit }, { releaseId, isSaved }) {
    // @todo コピーしないと表示に反映されない
    const releaseList = [...state.releaseList];
    const savedReleaseIndex = releaseList.findIndex((release) => release.id === releaseId);
    // ライブラリに存在する場合、削除したリリースは削除し、保存したリリースは再度先頭にするためにライブラリからは一度削除
    if (savedReleaseIndex !== -1) {
      // savedReleaseIndex から1個取り除く
      releaseList.splice(savedReleaseIndex, 1);
      commit('SET_RELEASE_LIST', releaseList);
    }

    // ライブラリ一覧に表示されてないリリースを保存した場合
    if (isSaved && savedReleaseIndex === -1) {
      commit('INCREMENT_UNUPDATED_COUNTS');
    }

    commit('SET_ACTUAL_IS_SAVED', [releaseId, isSaved]);
  },
};

export default actions;
