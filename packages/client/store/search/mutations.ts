/* eslint-disable no-param-reassign */
import type { VuexMutations } from 'typed-vuex';

import type { SpotifyAPI } from 'shared/types';
import type { State } from './types';

export type Mutations = {
  SET_ALBUMS: SpotifyAPI.SimpleAlbum[] | undefined;
  SET_ARTISTS: SpotifyAPI.Artist[] | undefined;
  SET_TRACKS: SpotifyAPI.Track[] | undefined;
  SET_PLAYLISTS: SpotifyAPI.SimplePlaylist[] | undefined;
  SET_SHOWS: SpotifyAPI.SimpleShow[] | undefined;
  SET_EPISODES: SpotifyAPI.SimpleEpisode[] | undefined;
}

const mutations: VuexMutations<State, Mutations> = {
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
