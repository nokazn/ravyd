import { Actions } from 'vuex';
import { PlaylistsState } from './state';
import { PlaylistsGetters } from './getters';
import { PlaylistsMutations } from './mutations';

export type PlaylistsActions = {
  getPlaylists: (payload?: { offset?: number, limit?: number }) => Promise<void>
  getAllPlaylists: () => Promise<void>
  createPlaylist: (payload: {
    name: string
    description: string
    isPublic: boolean
  }) => Promise<void>
  editPlaylist: (payload: {
    playlistId: string
    name: string
    description: string
    isPublic: boolean
  }) => Promise<void>
  followPlaylist: (playlistId: string) => Promise<void>
  unfollowPlaylist: (playlistId: string) => Promise<void>
}

export type RootActions = {
  'playlists/getPlaylists': PlaylistsActions['getPlaylists']
  'playlists/getAllPlaylists': PlaylistsActions['getAllPlaylists']
  'playlists/createPlaylist': PlaylistsActions['createPlaylist']
  'playlists/editPlaylist': PlaylistsActions['editPlaylist']
  'playlists/followPlaylist': PlaylistsActions['followPlaylist']
  'playlists/unfollowPlaylist': PlaylistsActions['unfollowPlaylist']
}

const actions: Actions<PlaylistsState, PlaylistsActions, PlaylistsGetters, PlaylistsMutations> = {
  async getPlaylists({ commit }, payload) {
    const limit = payload?.limit ?? 50;
    const offset = payload?.offset;
    const playlists = await this.$spotify.playlists.getListOfCurrentUserPlaylist({
      limit,
      offset,
    });

    commit('SET_PLAYLISTS', playlists?.items);
  },

  async getAllPlaylists({ commit }) {
    const limit = 50;
    const firstListOfPlaylists = await this.$spotify.playlists.getListOfCurrentUserPlaylist({
      limit,
    });

    if (firstListOfPlaylists == null) {
      commit('SET_PLAYLISTS', firstListOfPlaylists);
      throw new Error('プレイリストの一覧を取得できませんでした。');
    }

    // offset: index から limit 件取得
    const handler = async (index: number) => {
      const playlists = await this.$spotify.playlists.getListOfCurrentUserPlaylist({
        offset: limit * (index + 1),
        limit,
      });
      if (playlists == null) return [];

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

  async createPlaylist({ commit, rootGetters }, { name, description, isPublic }) {
    const userId = rootGetters['auth/userId'];
    if (userId == null) return;

    const playlist = await this.$spotify.playlists.createPlaylist({
      userId,
      name,
      // 空文字列の場合は undefined にする
      description: description || undefined,
      isPublic,
    });
    if (playlist == null) {
      throw new Error('プレイリストの作成に失敗しました。');
    }

    commit('ADD_PLAYLIST', playlist);
  },

  async editPlaylist({ state, commit }, {
    playlistId, name, description, isPublic,
  }) {
    await this.$spotify.playlists.editPlaylistDetail({
      playlistId,
      name,
      // @to-do 空文字列を渡せない
      description: description || undefined,
      isPublic,
    }).catch((err: Error) => {
      console.error(err.message);
      throw new Error('プレイリストの更新に失敗しました。');
    });

    const { playlists } = state;
    const index = playlists?.findIndex((playlist) => playlist.id === playlistId);
    if (index == null || index === -1) {
      throw new Error('プレイリスト一覧の更新に失敗しました。');
    }

    commit('EDIT_PLAYLIST', {
      index,
      id: playlistId,
      name,
      // 空文字列の場合は null にする
      description: description || null,
      isPublic,
    });
  },

  async followPlaylist({ state, commit, rootGetters }, playlistId) {
    await this.$spotify.following.followPlaylist({ playlistId })
      .catch((err: Error) => {
        throw new Error(err.message);
      });

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
  },

  async unfollowPlaylist({ commit }, playlistId) {
    await this.$spotify.following.unfollowPlaylist({ playlistId })
      .catch((err: Error) => {
        throw new Error(err.message);
      });

    commit('REMOVE_PLAYLIST', playlistId);
    commit('SET_ACTUAL_IS_SAVED', [playlistId, false]);
  },
};

export default actions;
