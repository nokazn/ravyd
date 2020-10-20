import { Actions } from 'typed-vuex';
import { PlaylistsState } from './state';
import { PlaylistsGetters } from './getters';
import { PlaylistsMutations } from './mutations';
import { OneToFifty } from '~~/types';
import { multipleRequests } from '~/utils/request/multipleRequests';

export type PlaylistsActions = {
  getPlaylists: (payload?: { offset?: number, limit?: OneToFifty }) => Promise<void>
  getAllPlaylists: () => Promise<void>
  createPlaylist: (payload: {
    name: string
    description?: string
    isPublic?: boolean
    isCollaborative?: boolean
    uriList?: string[]
  }) => Promise<void>
  editPlaylist: (payload: {
    playlistId: string
    name?: string
    description?: string
    isPublic?: boolean
    isCollaborative?: boolean
  }) => Promise<void>
  followPlaylist: (playlistId: string) => Promise<void>
  unfollowPlaylist: (params: {
    playlistId: string
    isOwnPlaylist: boolean
  }) => Promise<void>
  addItemToPlaylist: (params: {
    playlistId: string
    playlistName: string
    uriList: string[]
    name: string
  }) => Promise<void>
  removePlaylistItem: (params: {
    playlistId: string
    track: {
      uri: string
      positions: [number]
    }
    name: string
  }) => Promise<void>
}

export type RootActions = {
  'playlists/getPlaylists': PlaylistsActions['getPlaylists']
  'playlists/getAllPlaylists': PlaylistsActions['getAllPlaylists']
  'playlists/createPlaylist': PlaylistsActions['createPlaylist']
  'playlists/editPlaylist': PlaylistsActions['editPlaylist']
  'playlists/followPlaylist': PlaylistsActions['followPlaylist']
  'playlists/unfollowPlaylist': PlaylistsActions['unfollowPlaylist']
  'playlists/addItemToPlaylist': PlaylistsActions['addItemToPlaylist']
  'playlists/removePlaylistItem': PlaylistsActions['removePlaylistItem']
}

const actions: Actions<PlaylistsState, PlaylistsActions, PlaylistsGetters, PlaylistsMutations> = {
  /**
   * ユーザーのプレイリストを取得する
   */
  async getPlaylists({ commit, dispatch }, payload) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    const limit = payload?.limit ?? 50;
    const offset = payload?.offset;
    const playlists = await this.$spotify.playlists.getListOfCurrentUserPlaylist({
      limit,
      offset,
    });
    if (playlists == null) {
      this.$toast.pushError('プレイリストの一覧を取得できませんでした。');
      return;
    }

    commit('SET_PLAYLISTS', playlists?.items);
  },

  /**
   * ユーザーのプレイリストを全件取得する
   */
  async getAllPlaylists({ commit, dispatch }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    const limit = 50;
    const firstListOfPlaylists = await this.$spotify.playlists.getListOfCurrentUserPlaylist({
      limit,
    });

    if (firstListOfPlaylists == null) {
      this.$toast.pushError('プレイリストの一覧を取得できませんでした。');

      return;
    }

    // offset: index から limit 件取得
    const handler = async (index: number) => {
      const playlists = await this.$spotify.playlists.getListOfCurrentUserPlaylist({
        offset: limit * (index + 1),
        limit,
      });
      if (playlists == null) {
        this.$toast.pushError('プレイリストの一部が取得できませんでした。');
        return [];
      }

      return playlists.items;
    };
    const unacquiredCounts = firstListOfPlaylists.total - limit;
    const listOfPlaylists = await multipleRequests(handler, unacquiredCounts, limit)
      .then((playlists) => playlists.flat());

    commit('SET_PLAYLISTS', [
      ...firstListOfPlaylists.items,
      ...listOfPlaylists,
    ]);
  },

  /**
   * プレイリストを新規作成する
   */
  async createPlaylist({ commit, dispatch, rootGetters }, {
    name,
    description,
    isPublic,
    isCollaborative,
    uriList: uris,
  }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    const userId = rootGetters['auth/userId'];
    if (userId == null) return;

    const playlist = await this.$spotify.playlists.createPlaylist({
      userId,
      name,
      // 空文字列の場合は undefined にする
      description: description || undefined,
      // コラボプレイリストの場合は非公開
      isPublic: isCollaborative ? false : isPublic,
      isCollaborative,
    });
    if (playlist == null) {
      throw new Error('プレイリストの作成に失敗しました。');
    }

    commit('ADD_PLAYLIST', playlist);

    // 新規作成したプレイリストに追加
    if (uris != null) {
      const limit = 100;
      const baseLists: string[][] = new Array(Math.ceil(uris.length / limit)).fill([]);
      const uriLists = uris.reduce((prev, uri, i) => {
        const index = Math.floor(i / limit);
        prev[index].push(uri);
        return prev;
      }, baseLists);

      const request = (uriList: string[]) => {
        return this.$spotify.playlists.addItemToPlaylist({
          playlistId: playlist.id,
          uriList,
        }).catch((err: Error) => {
          console.error({ err });
          throw err;
        });
      };

      await Promise.all(uriLists.map((uriList) => request(uriList)))
        .catch((err: Error) => {
          console.error({ err });
          throw new Error('プレイリストにアイテムの一部または全部を追加できませんでした。');
        });
    }
  },

  /**
   * 自分がオーナーのプレイリスト情報を編集数ｒ
   */
  async editPlaylist({ commit, dispatch }, {
    playlistId,
    name,
    description,
    isPublic,
    isCollaborative,
  }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    await this.$spotify.playlists.editPlaylistDetail({
      playlistId,
      name,
      // @todo 空文字列を渡せない
      description: description || undefined,
      isPublic: isCollaborative ? false : isPublic,
      isCollaborative,
    }).then(() => {
      commit('EDIT_PLAYLIST', {
        id: playlistId,
        name,
        description,
        // コラボプレイリストの場合は非公開
        isPublic: isCollaborative ? false : isPublic,
        isCollaborative,
      });
    }).catch((err: Error) => {
      console.error({ err });
      throw new Error('プレイリストの更新に失敗しました。');
    });
  },

  /**
   * プレイリストをフォローする
   */
  async followPlaylist({
    state,
    commit,
    dispatch,
    rootGetters,
  }, playlistId) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    await this.$spotify.following.followPlaylist({ playlistId })
      .then(async () => {
        const currentPlaylists = state.playlists;
        if (currentPlaylists != null) {
          const savedPlaylist = currentPlaylists.find((item) => item.id === playlistId);
          // すでに一覧に存在する場合
          if (savedPlaylist != null) {
            commit('SET_ACTUAL_IS_SAVED', [playlistId, true]);
            return;
          }
        }

        const market = rootGetters['auth/userCountryCode'];
        const playlist = await this.$spotify.playlists.getPlaylist({
          playlistId,
          market,
        });

        if (playlist != null) {
          commit('ADD_PLAYLIST', playlist);
          commit('SET_ACTUAL_IS_SAVED', [playlistId, true]);
        }
      })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.pushError('プレイリストのフォローに失敗しました。');
      });
  },

  /**
   * プレイリストのフォローを解除する
   */
  async unfollowPlaylist({ commit, dispatch }, { playlistId, isOwnPlaylist }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    await this.$spotify.following.unfollowPlaylist({ playlistId })
      .then(() => {
        commit('REMOVE_PLAYLIST', playlistId);
        commit('SET_ACTUAL_IS_SAVED', [playlistId, false]);
        if (isOwnPlaylist) {
          this.$toast.pushPrimary('プレイリストを削除しました。');
          // @todo プレイリスト一覧に飛ばす
          this.$router.replace('/');
        }
      })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.pushError(isOwnPlaylist
          ? 'プレイリストの削除に失敗しました。'
          : 'プレイリストのフォローの解除に失敗しました。');
      });
  },

  /**
   * プレイリストにアイテムを追加
   */
  async addItemToPlaylist({ state, commit, dispatch }, {
    playlistId,
    playlistName,
    uriList,
    name,
  }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    const { snapshot_id } = await this.$spotify.playlists.addItemToPlaylist({
      playlistId,
      uriList,
    });

    if (snapshot_id == null) {
      this.$toast.pushError(`"${name}" を "${playlistName}" に追加できませんでした。`);
      return;
    }

    const { playlists } = state;
    const playlist = playlists?.find((item) => item.id === playlistId);
    // フォローしている自分のプレイリストにアイテムを追加した時
    if (playlist?.tracks != null) {
      const total = playlist.tracks.total + 1;
      commit('MODIFY_PLAYLIST_TOTAL_TRACKS', { playlistId, total });
    }

    const currentUnupdatedCounts = state.unupdatedTrackCountsMap.get(playlistId) ?? 0;
    commit('INCREMENT_UNUPDATED_TRACKS_MAP', [playlistId, currentUnupdatedCounts + 1]);
    this.$toast.pushPrimary(`"${name}" を "${playlistName}" に追加しました。`);
  },

  /**
   * プレイリストから1曲削除
   */
  async removePlaylistItem({ state, commit, dispatch }, { playlistId, track, name }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    const [snapshotId] = await this.$spotify.playlists.removePlaylistItems({
      playlistId,
      tracks: [track],
    });

    if (snapshotId == null) {
      this.$toast.pushError(`${name}をこのプレイリストから削除できませんでした。`);
      return;
    }

    const { playlists } = state;
    const playlist = playlists?.find((item) => item.id === playlistId);
    // フォローしている自分のプレイリストのアイテムを削除した時
    if (playlist?.tracks != null) {
      const total = playlist.tracks.total - 1;
      commit('MODIFY_PLAYLIST_TOTAL_TRACKS', { playlistId, total });
    }

    commit('SET_ACTUALLY_DELETED_TRACK', [playlistId, track]);

    this.$toast.pushPrimary(`${name}をこのプレイリストから削除しました。`);
  },
};

export default actions;
