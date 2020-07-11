import { Actions } from 'vuex';
import { PlaylistsState } from './state';
import { PlaylistsGetters } from './getters';
import { PlaylistsMutations } from './mutations';

export type PlaylistsActions = {
  getPlaylists: (payload?: { offset?: number, limit?: number }) => Promise<void>
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
  async getPlaylists({ commit }, payload) {
    const limit = payload?.limit ?? 50;
    const offset = payload?.offset;
    const playlists = await this.$spotify.playlists.getListOfCurrentUserPlaylist({
      limit,
      offset,
    });
    if (playlists == null) {
      this.$toast.show('error', 'プレイリストの一覧を取得できませんでした。');
      return;
    }

    commit('SET_PLAYLISTS', playlists?.items);
  },

  async getAllPlaylists({ commit }) {
    const limit = 50;
    const firstListOfPlaylists = await this.$spotify.playlists.getListOfCurrentUserPlaylist({
      limit,
    });

    if (firstListOfPlaylists == null) {
      this.$toast.show('error', 'プレイリストの一覧を取得できませんでした。');
      return;
    }

    // offset: index から limit 件取得
    const handler = async (index: number) => {
      const playlists = await this.$spotify.playlists.getListOfCurrentUserPlaylist({
        offset: limit * (index + 1),
        limit,
      });
      if (playlists == null) {
        this.$toast.show('error', 'プレイリストの一部が取得できませんでした。');
        return [];
      }

      return playlists.items;
    };
    const unacquiredCounts = firstListOfPlaylists.total - limit;
    const handlerCounts = Math.ceil(unacquiredCounts / limit);

    const listOfPlaylists = await Promise.all(new Array(handlerCounts)
      .fill(undefined)
      .map((_, index) => handler(index)))
      .then((listsOfPlaylists) => listsOfPlaylists.flat());

    commit('SET_PLAYLISTS', [
      ...firstListOfPlaylists.items,
      ...listOfPlaylists,
    ]);
  },

  async createPlaylist({ commit, rootGetters }, {
    name,
    description,
    isPublic,
    isCollaborative,
    uriList: uris,
  }) {
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

      const request = (uriList: string[]) => this.$spotify.playlists.addItemToPlaylist({
        playlistId: playlist.id,
        uriList,
      }).catch((err: Error) => {
        console.error({ err });
        throw new Error(err.message);
      });

      await Promise.all(uriLists.map((uriList) => request(uriList)))
        .catch((err: Error) => {
          console.error({ err });
          throw new Error('プレイリストにアイテムの一部または全部を追加できませんでした。');
        });
    }
  },

  async editPlaylist({ commit }, {
    playlistId, name, description, isPublic, isCollaborative,
  }) {
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

  async followPlaylist({ state, commit, rootGetters }, playlistId) {
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
        this.$toast.show('error', 'プレイリストのフォローに失敗しました。');
      });
  },

  async unfollowPlaylist({ commit }, { playlistId, isOwnPlaylist }) {
    await this.$spotify.following.unfollowPlaylist({ playlistId })
      .then(() => {
        commit('REMOVE_PLAYLIST', playlistId);
        commit('SET_ACTUAL_IS_SAVED', [playlistId, false]);
        if (isOwnPlaylist) {
          this.$toast.show('primary', 'プレイリストを削除しました。');
          // @todo プレイリスト一覧に飛ばす
          this.$router.push('/');
        }
      })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.show('error', isOwnPlaylist
          ? 'プレイリストの削除に失敗しました。'
          : 'プレイリストのフォローの解除に失敗しました。');
      });
  },

  async addItemToPlaylist({ state, commit }, {
    playlistId, playlistName, uriList, name,
  }) {
    const { snapshot_id } = await this.$spotify.playlists.addItemToPlaylist({
      playlistId,
      uriList,
    });

    if (snapshot_id == null) {
      this.$toast.show('error', `"${name}" を "${playlistName}" に追加できませんでした。`);
      return;
    }

    const { playlists } = state;
    const playlist = playlists?.find((item) => item.id === playlistId);
    // フォローしている自分のプレイリストにアイテムを追加した時
    if (playlist?.tracks != null) {
      const total = playlist.tracks.total + 1;
      commit('MODIFY_PLAYLIST_TOTAL_TRACKS', { playlistId, total });
    }

    const currentUnupdatedCounts = state.numberOfUnupdatedTracksMap.get(playlistId) ?? 0;
    commit('INCREMENT_UNUPDATED_TRACKS_MAP', [playlistId, currentUnupdatedCounts + 1]);

    this.$toast.show('primary', `"${name}" を "${playlistName}" に追加しました。`);
  },

  /**
   * プレイリストから1曲削除
   */
  async removePlaylistItem({ state, commit }, { playlistId, track, name }) {
    const { snapshot_id } = await this.$spotify.playlists.removePlaylistItems({
      playlistId,
      tracks: [track],
    });

    if (snapshot_id == null) {
      this.$toast.show('error', `${name}をこのプレイリストから削除できませんでした。`);
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

    this.$toast.show('primary', `${name}をこのプレイリストから削除しました。`);
  },
};

export default actions;
