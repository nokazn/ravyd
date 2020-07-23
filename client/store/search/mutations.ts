/* eslint-disable no-param-reassign */
import { Mutations } from 'typed-vuex';

import { SearchState } from './state';
import { SpotifyAPI } from '~~/types';

export type SearchMutations = {
  SET_ALBUMS: SpotifyAPI.SimpleAlbum[] | undefined
  SET_ARTISTS: SpotifyAPI.Artist[] | undefined
  SET_TRACKS: SpotifyAPI.Track[] | undefined
  SET_PLAYLISTS: SpotifyAPI.SimplePlaylist[] | undefined
  SET_SHOWS: SpotifyAPI.SimpleShow[] | undefined
  SET_EPISODES: SpotifyAPI.SimpleEpisode[] | undefined
}

export type RootMutations = {
  'search/SET_ALBUMS': SearchMutations['SET_ALBUMS']
  'search/SET_ARTISTS': SearchMutations['SET_ARTISTS']
  'search/SET_TRACKS': SearchMutations['SET_TRACKS']
  'search/SET_PLAYLISTS': SearchMutations['SET_PLAYLISTS']
  'search/SET_SHOWS': SearchMutations['SET_SHOWS']
  'search/SET_EPISODES': SearchMutations['SET_EPISODES']
}

const mutations: Mutations<SearchState, SearchMutations> = {
  SET_ALBUMS(state, albums) {
    state.albums = albums;
  },

  SET_ARTISTS(state, artists) {
    state.artists = artists;
  },

  SET_TRACKS(state, tracks) {
    state.tracks = tracks;
  },

  SET_PLAYLISTS(state, playlists) {
    state.playlists = playlists;
  },

  SET_SHOWS(state, shows) {
    state.shows = shows;
  },

  SET_EPISODES(state, episodes) {
    state.episodes = episodes;
  },

};

export default mutations;
