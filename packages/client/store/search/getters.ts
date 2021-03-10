import type { VuexGetters } from 'typed-vuex';

import { convertToContentListItem } from '~/services/converter';
import type { App } from '~/entities';
import type { State } from './types';

export type Getters = {
  tracks: App.ContentItem<'track'>[];
  artists: App.ContentItem<'artist'>[];
  albums: App.ContentItem<'album'>[];
  playlists: App.ContentItem<'playlist'>[];
  shows: App.ContentItem<'show'>[];
  episodes: App.ContentItem<'episode'>[];
}

const getters: VuexGetters<State, Getters> = {
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
