import type { VuexActions } from 'typed-vuex';
import type { Context } from '@nuxt/types';

import type { SpotifyAPI, OneToFifty } from 'shared/types';
import type { State, Mutations, Getters } from './types';

interface SearchParams {
  query: string;
  limit?: OneToFifty;
  offset?: number;
}

export type Actions = {
  searchAllItems: (params: SearchParams) => Promise<void>;
  searchAlbums: (params: SearchParams) => Promise<void>;
  searchArtists: (params: SearchParams) => Promise<void>;
  searchTracks: (params: SearchParams) => Promise<void>;
  searchPlaylists: (params: SearchParams) => Promise<void>;
  searchShows: (params: SearchParams) => Promise<void>;
  searchEpisodes: (params: SearchParams) => Promise<void>;
}

const searchEachItemHandler = <T extends SpotifyAPI.SearchType>(
  app: Context['app'],
  type: T,
) => ({ query, limit, offset }: SearchParams): Promise<SpotifyAPI.SearchResult<T>> => {
    const typeList = [type];
    const request = app.$spotify.search.searchItems({
      query,
      typeList,
      limit,
      offset,
    });

    return request;
  };

const actions: VuexActions<State, Actions, Getters, Mutations> = {
  async searchAllItems({ commit }, { query, limit, offset }) {
    const typeList: SpotifyAPI.SearchType[] = [
      'album',
      'artist',
      'track',
      'playlist',
      'show',
      'episode',
    ];

    const {
      albums,
      artists,
      tracks,
      playlists,
      shows,
      episodes,
    } = await this.$spotify.search.searchItems({
      query,
      typeList,
      limit,
      offset,
    });
    const filteredEpisodes = episodes?.items
      .filter((episode): episode is SpotifyAPI.Episode => episode != null);
    commit('SET_ALBUMS', albums?.items);
    commit('SET_ARTISTS', artists?.items);
    commit('SET_TRACKS', tracks?.items);
    commit('SET_PLAYLISTS', playlists?.items);
    commit('SET_SHOWS', shows?.items);
    commit('SET_EPISODES', filteredEpisodes);
  },

  async searchAlbums({ commit }, params) {
    const { albums } = await searchEachItemHandler(this.app, 'album')(params);
    commit('SET_ALBUMS', albums?.items);
  },

  async searchArtists({ commit }, params) {
    const { artists } = await searchEachItemHandler(this.app, 'artist')(params);
    commit('SET_ARTISTS', artists?.items);
  },

  async searchTracks({ commit }, params) {
    const { tracks } = await searchEachItemHandler(this.app, 'track')(params);
    commit('SET_TRACKS', tracks?.items);
  },

  async searchPlaylists({ commit }, params) {
    const { playlists } = await searchEachItemHandler(this.app, 'playlist')(params);
    commit('SET_PLAYLISTS', playlists?.items);
  },

  async searchShows({ commit }, params) {
    const { shows } = await searchEachItemHandler(this.app, 'show')(params);
    commit('SET_SHOWS', shows?.items);
  },

  async searchEpisodes({ commit }, params) {
    const { episodes } = await searchEachItemHandler(this.app, 'episode')(params) ?? {};
    const filteredEpisodes = episodes?.items
      .filter((episode): episode is SpotifyAPI.SimpleEpisode => episode != null);
    commit('SET_EPISODES', filteredEpisodes);
  },
};

export default actions;
