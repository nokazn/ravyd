import { Actions } from 'vuex';

import { convertArtistForCard } from '~/scripts/converter/convertArtistForCard';
import { LibraryArtistsState } from './state';
import { LibraryArtistsGetters } from './getters';
import { LibraryArtistsMutations } from './mutations';
import { SpotifyAPI, OneToFifty, TODO } from '~~/types';

export type LibraryArtistsActions = {
  getSavedArtistList: (payload?: { limit: OneToFifty } | undefined) => Promise<void>
  updateLatestSavedArtistList: () => Promise<void>
  followArtists: (artistIdList: string[]) => Promise<void>
  unfollowArtists: (artistIdList: string[]) => Promise<void>
  modifyArtistSavedState: ({ artistId, isSaved }: {
    artistId: string
    isSaved: boolean
  }) => void
};

export type RootActions = {
  'library/artists/getSavedArtistList': LibraryArtistsActions['getSavedArtistList']
  'library/artists/updateLatestSavedArtistList': LibraryArtistsActions['updateLatestSavedArtistList']
  'library/artists/followArtists': LibraryArtistsActions['followArtists']
  'library/artists/unfollowArtists': LibraryArtistsActions['unfollowArtists']
  'library/artists/modifyArtistSavedState': LibraryArtistsActions['modifyArtistSavedState']
};

const convertArtist = (artist: SpotifyAPI.Artist) => convertArtistForCard(artist);

const actions: Actions<
  LibraryArtistsState,
  LibraryArtistsActions,
  LibraryArtistsGetters,
  LibraryArtistsMutations
> = {
  /**
   * 指定されない場合は limit: 30 で取得
   */
  async getSavedArtistList({ commit, getters }, payload) {
    // すでに全データを取得している場合は何もしない
    if (getters.isFull) return;

    const limit = payload?.limit ?? 30;
    const after = getters.lastArtistId;
    const { artists } = await this.$spotify.following.getUserFollowed({
      type: 'artist',
      limit,
      after,
    });
    if (artists == null) {
      this.$toast.show('error', 'フォロー中のアーティストの一覧を取得できませんでした。');
      return;
    }

    const artistList = artists.items.map(convertArtist);

    commit('ADD_TO_ARTIST_LIST', artistList);
    commit('SET_TOTAL', artists.total);
  },

  /**
   * 未更新分を追加
   * @todo 追加順に取得できないので未更新分を上から見ていっても意味ない
   */
  async updateLatestSavedArtistList({ state, commit }) {
    // ライブラリの情報が更新されていないものの数
    const unupdatedCounts = state.numberOfUnupdatedArtist;
    if (unupdatedCounts === 0) return;

    const maxLimit = 50;
    // @todo コンパイルを通すためにとりあえずキャストする
    const { artists } = await this.$spotify.following.getUserFollowed({
      type: 'artist',
      limit: Math.min(unupdatedCounts, maxLimit) as TODO,
    });
    if (artists == null) {
      this.$toast.show('error', 'フォロー中のアーティストの一覧を更新できませんでした。');
      return;
    }

    const currentArtistList = state.artistList;
    // 現在のライブラリが未取得ならそのままセット
    if (currentArtistList == null) {
      commit('SET_ARTIST_LIST', artists.items.map(convertArtist));
      commit('SET_TOTAL', artists.total);
      commit('RESET_NUMBER_OF_UNUPDATED_ARTISTS');
      return;
    }

    // @todo lastRelease の位置まで取得すべき?
    // 現在のライブラリの先頭があるかどうか
    const currentLatestArtistId = currentArtistList[0].id;
    const lastArtistIndex = artists.items
      .findIndex((artist) => artist.id === currentLatestArtistId);

    const addedArtistList = lastArtistIndex === -1
      ? artists.items.map(convertArtist)
      : artists.items.slice(0, lastArtistIndex).map(convertArtist);

    commit('UNSHIFT_TO_ARTIST_LIST', addedArtistList);
    commit('SET_TOTAL', artists.total);
    commit('RESET_NUMBER_OF_UNUPDATED_ARTISTS');
  },

  async followArtists({ dispatch }, artistIdList) {
    await this.$spotify.following.follow({
      type: 'artist',
      artistIdList,
    }).catch((err: Error) => {
      console.error({ err });
      this.$toast.show('error', 'フォローに失敗しました。');
    });

    artistIdList.forEach((artistId) => {
      dispatch('modifyArtistSavedState', {
        artistId,
        isSaved: true,
      });
    });
  },

  async unfollowArtists({ dispatch }, artistIdList) {
    await this.$spotify.following.unfollow({
      type: 'artist',
      artistIdList,
    }).catch((err: Error) => {
      console.error({ err });
      this.$toast.show('error', 'フォローの解除に失敗しました。');
    });

    artistIdList.forEach((artistId) => {
      dispatch('modifyArtistSavedState', {
        artistId,
        isSaved: false,
      });
    });
  },

  modifyArtistSavedState({ state, commit }, { artistId, isSaved }) {
    const currentArtistList = state.artistList;
    if (currentArtistList == null) return;

    const savedArtistIndex = currentArtistList
      .findIndex((artist) => artist.id === artistId);
    // ライブラリに存在する場合、削除したリリースは削除し、保存したリリースは再度先頭にするためにライブラリからは一度削除
    if (savedArtistIndex !== -1) {
      const nextArtistList = [...currentArtistList];
      // savedArtistIndex から1個取り除く
      nextArtistList.splice(savedArtistIndex, 1);
      commit('SET_ARTIST_LIST', nextArtistList);
    }

    // ライブラリ一覧に表示されてないリリースを保存した場合
    if (isSaved && savedArtistIndex === -1) {
      commit('INCREMENT_NUMBER_OF_UNUPDATED_ARTISTS');
    }

    commit('SET_ACTUAL_IS_SAVED', [artistId, isSaved]);
  },
};

export default actions;
