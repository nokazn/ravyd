import { Getters } from 'typed-vuex';

import { convertToContentListItem } from '~/utils/converter/convertToContentListItem';
import { SearchState } from './state';
import { App } from '~~/types';

export type SearchGetters = {
  tracks: App.ContentItemInfo<'track'>[]
  artists: App.ContentItemInfo<'artist'>[]
  albums: App.ContentItemInfo<'album'>[]
  playlists: App.ContentItemInfo<'playlist'>[]
  shows: App.ContentItemInfo<'show'>[]
  episodes: App.ContentItemInfo<'episode'>[]
}

export type RootGetters = {
  'search/tracks': SearchGetters['tracks']
  'search/artists': SearchGetters['artists']
  'search/albums': SearchGetters['albums']
  'search/playlists': SearchGetters['playlists']
  'search/shows': SearchGetters['shows']
  'search/episodes': SearchGetters['episodes']
}

const getters: Getters<SearchState, SearchGetters> = {
  tracks(state) {
    return state.tracks?.map(convertToContentListItem('track')) ?? [];
  },

  artists(state) {
    return state.artists?.map(convertToContentListItem('artist')) ?? [];
  },

  albums(state) {
    return state.albums?.map(convertToContentListItem('album')) ?? [];
  },

  playlists(state) {
    return state.playlists?.map(convertToContentListItem('playlist')) ?? [];
  },

  shows(state) {
    return state.shows?.map(convertToContentListItem('show')) ?? [];
  },

  episodes(state) {
    return state.episodes?.map(convertToContentListItem('episode')) ?? [];
  },
};

export default getters;
