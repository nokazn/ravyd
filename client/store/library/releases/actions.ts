import { Actions } from 'vuex';

import { convertReleaseForCard } from '~/scripts/converter/convertReleaseForCard';
import { LibraryReleasesState } from './state';
import { LibraryReleasesGetters } from './getters';
import { LibraryReleasesMutations } from './mutations';
import { SpotifyAPI, OneToFifty } from '~~/types';

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
   * 指定されない場合は limit: 30 で取得
   */
  async getSavedReleaseList({ commit, getters, rootGetters }, payload) {
    // すでに全データを取得している場合は何もしない
    if (getters.isFull) return;

    const limit = payload?.limit ?? 30;
    const offset = getters.releaseListLength;
    const market = rootGetters['auth/userCountryCode'];
    const releases = await this.$spotify.library.getUserSavedAlbums({
      limit,
      offset,
      market,
    });
    if (releases == null) {
      this.$toast.show('error', 'お気に入りのアルバムの一覧を取得できませんでした。');
      return;
    }

    const releaseList = releases.items.map(convertRelease);
    commit('ADD_TO_RELEASE_LIST', releaseList);
    commit('SET_TOTAL', releases.total);
  },

  /**
   * 未更新分を追加
   */
  async updateLatestSavedReleaseList({ state, commit, rootGetters }) {
    type LibraryOfReleases = SpotifyAPI.LibraryOf<'album'>;
    // ライブラリの情報が更新されていないものの数
    const unupdatedCounts = state.numberOfUnupdatedReleases;
    if (unupdatedCounts === 0) return;

    const limit = 50;
    const market = rootGetters['auth/userCountryCode'];
    const handler = (index: number): Promise<LibraryOfReleases | undefined> => {
      const offset = limit * index;
      return this.$spotify.library.getUserSavedAlbums({
        limit,
        offset,
        market,
      });
    };
    const handlerCounts = Math.ceil(unupdatedCounts / limit);

    const releases: LibraryOfReleases | undefined = await Promise.all(new Array(handlerCounts)
      .fill(undefined)
      .map((_, i) => handler(i)))
      .then((pagings) => pagings.reduce((prev, curr) => {
        // 1つでもリクエストが失敗したらすべて無効にする
        if (prev == null || curr == null) return undefined;
        return {
          ...curr,
          items: [...prev.items, ...curr.items],
        };
      }, {} as LibraryOfReleases));

    if (releases == null) {
      this.$toast.show('error', 'お気に入りのアルバムの一覧を更新できませんでした。');
      return;
    }

    const currentReleaseList = state.releaseList;
    // 現在のライブラリが未取得ならそのままセット
    if (currentReleaseList == null) {
      commit('SET_RELEASE_LIST', releases.items.map(convertRelease));
      commit('SET_TOTAL', releases.total);
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
    commit('RESET_NUMBER_OF_UNUPDATED_RELEASES');
  },

  async saveReleases({ dispatch }, albumIdList) {
    await this.$spotify.library.saveAlbums({ albumIdList })
      .catch((err) => {
        console.error({ err });
        this.$toast.show('error', 'ライブラリにアルバムを保存できませんでした。');
      });

    albumIdList.forEach((releaseId) => {
      dispatch('modifyReleaseSavedState', {
        releaseId,
        isSaved: true,
      });
    });
  },

  async removeReleases({ dispatch }, albumIdList) {
    await this.$spotify.library.removeUserSavedAlbums({ albumIdList })
      .catch((err) => {
        console.error({ err });
        this.$toast.show('error', 'ライブラリからアルバムを削除できませんでした。');
      });

    albumIdList.forEach((releaseId) => {
      dispatch('modifyReleaseSavedState', {
        releaseId,
        isSaved: false,
      });
    });
  },

  modifyReleaseSavedState({ state, commit }, { releaseId, isSaved }) {
    const currentReleaseList = state.releaseList;
    if (currentReleaseList == null) return;

    const savedReleaseIndex = currentReleaseList
      .findIndex((release) => release.id === releaseId);
    // ライブラリに存在する場合、削除したリリースは削除し、保存したリリースは再度先頭にするためにライブラリからは一度削除
    if (savedReleaseIndex !== -1) {
      const nextReleaseList = [...currentReleaseList];
      // savedReleaseIndex から1個取り除く
      nextReleaseList.splice(savedReleaseIndex, 1);
      commit('SET_RELEASE_LIST', nextReleaseList);
    }

    // ライブラリ一覧に表示されてないリリースを保存した場合
    if (isSaved && savedReleaseIndex === -1) {
      commit('INCREMENT_NUMBER_OF_UNUPDATED_RELEASES');
    }

    commit('SET_ACTUAL_IS_SAVED', [releaseId, isSaved]);
  },
};

export default actions;
