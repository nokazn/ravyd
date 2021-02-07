import { Getters } from 'typed-vuex';

import type { App } from '~/entities';
import { convertToContentListItem } from '~/services/converter';
import { SearchState } from './state';

export type SearchGetters = {
  tracks: App.ContentItem<'track'>[]
  artists: App.ContentItem<'artist'>[]
  albums: App.ContentItem<'album'>[]
  playlists: App.ContentItem<'playlist'>[]
  shows: App.ContentItem<'show'>[]
  episodes: App.ContentItem<'episode'>[]
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
