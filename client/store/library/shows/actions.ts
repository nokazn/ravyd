import { Actions } from 'typed-vuex';

import { LibraryShowsState } from './state';
import { LibraryShowsGetters } from './getters';
import { LibraryShowsMutations } from './mutations';
import { convertShowForCard } from '~/utils/converter';
import { EMPTY_PAGING } from '~/constants';
import { OneToFifty, SpotifyAPI } from '~~/types';

export type LibraryShowsActions = {
  getSavedShowList: (payload?: { limit: OneToFifty } | undefined) => Promise<void>
  updateLatestSavedShowList: () => Promise<void>
  saveShows: (showIdList: string[]) => Promise<void>
  removeShows: (showIdList: string[]) => Promise<void>
  modifyShowSavedState: ({ showId, isSaved }: {
    showId: string
    isSaved: boolean
  }) => void
}

export type RootActions = {
  'library/shows/getSavedShowList': LibraryShowsActions['getSavedShowList']
  'library/shows/updateLatestSavedShowList': LibraryShowsActions['updateLatestSavedShowList']
  'library/shows/saveShows': LibraryShowsActions['saveShows']
  'library/shows/removeShows': LibraryShowsActions['removeShows']
  'library/shows/modifyShowSavedState': LibraryShowsActions['modifyShowSavedState']
}

const actions: Actions<
  LibraryShowsState,
  LibraryShowsActions,
  LibraryShowsGetters,
  LibraryShowsMutations
> = {
  /**
   * 保存済みのポッドキャストを取得
   * 指定されない場合は limit: 30 で取得
   */
  async getSavedShowList({
    getters,
    commit,
    dispatch,
    rootGetters,
  }, payload) {
    if (getters.isFull) return;

    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;


    const limit = payload?.limit ?? 30;
    const offset = getters.showListLength;
    const market = rootGetters['auth/userCountryCode'];
    const shows = await this.$spotify.library.getUserSavedShows({
      limit,
      offset,
      market,
    });
    if (shows == null) {
      this.$toast.push({
        color: 'error',
        message: 'お気に入りのポッドキャストの一覧を取得できませんでした。',
      });

      return;
    }

    const showList = shows.items.map(({ show }) => convertShowForCard(show));
    commit('ADD_TO_SHOW_LIST', showList);
    commit('SET_TOTAL', shows.total);
  },

  /**
   * 未更新のポッドキャストを追加
   */
  async updateLatestSavedShowList({
    state,
    commit,
    dispatch,
    rootGetters,
  }) {
    type LibraryOfShows = SpotifyAPI.LibraryOf<'show'>;
    // ライブラリの情報が更新されていないものの数
    const {
      showList: currentShowList,
      unupdatedCounts,
    } = state;
    if (unupdatedCounts === 0) return;

    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    const maxLimit = 50;
    const limit = Math.min(unupdatedCounts, maxLimit) as OneToFifty;
    const market = rootGetters['auth/userCountryCode'];
    const handler = (index: number): Promise<LibraryOfShows | undefined> => {
      const offset = limit * index;
      return this.$spotify.library.getUserSavedShows({
        limit,
        offset,
        market,
      });
    };
    const handlerCounts = Math.ceil(unupdatedCounts / maxLimit);

    const shows: LibraryOfShows | undefined = await Promise.all(new Array(handlerCounts)
      .fill(undefined)
      .map((_, i) => handler(i)))
      .then((pagings) => pagings.reduce((prev, curr) => {
        // 1つでもリクエストが失敗したらすべて無効にする
        if (prev == null || curr == null) return undefined;
        return {
          ...curr,
          items: [...prev.items, ...curr.items],
        };
      }, EMPTY_PAGING as LibraryOfShows));

    if (shows == null) {
      this.$toast.push({
        color: 'error',
        message: 'お気に入りのエピソードの一覧を取得できませんでした。',
      });

      return;
    }

    const currentLatestShowId = currentShowList[0]?.id;
    const lastShowIndex = shows.items
      .findIndex(({ show }) => show.id === currentLatestShowId);

    const addedShowList = lastShowIndex === -1
      ? shows.items.map(({ show }) => convertShowForCard(show))
      : shows.items.slice(0, lastShowIndex).map(({ show }) => convertShowForCard(show));

    commit('UNSHIFT_TO_SHOW_LIST', addedShowList);
    commit('SET_TOTAL', shows.total);
    commit('RESET_UNUPDATED_COUNTS');
  },

  /**
   * ポッドキャストを保存
   */
  async saveShows({ dispatch }, showIdList) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    await this.$spotify.library.saveShows({ showIdList })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.push({
          color: 'error',
          message: 'エピソードをフォローできませんでした。',
        });
      });

    showIdList.forEach((showId) => {
      dispatch('modifyShowSavedState', {
        showId,
        isSaved: true,
      });
    });
  },

  /**
   * 保存済のポッドキャストを削除
   */
  async removeShows({ dispatch }, showIdList) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    await this.$spotify.library.removeUserSavedShows({ showIdList })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.push({
          color: 'error',
          message: 'エピソードのフォローを解除できませんでした。',
        });
      });

    showIdList.forEach((showId) => {
      dispatch('modifyShowSavedState', {
        showId,
        isSaved: false,
      });
    });
  },

  /**
   * saveShows, removeShows から呼ばれる
   */
  modifyShowSavedState({ state, commit }, { showId, isSaved }) {
    // @todo コピーしないと表示に反映されない
    const showList = [...state.showList];
    const savedShowIndex = showList.findIndex((show) => show.id === showId);
    // ライブラリに存在する場合、削除したリリースは削除し、保存したリリースは再度先頭にするためにライブラリからは一度削除
    if (savedShowIndex !== -1) {
      // savedShowIndex から1個取り除く
      showList.splice(savedShowIndex, 1);
      commit('SET_SHOW_LIST', showList);
    }

    // ライブラリ一覧に表示されてないリリースを保存した場合
    if (isSaved && savedShowIndex === -1) {
      commit('INCREMENT_UNUPDATED_COUNTS');
    }

    commit('SET_ACTUAL_IS_SAVED', [showId, isSaved]);
  },

};

export default actions;
