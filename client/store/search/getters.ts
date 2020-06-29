import { Getters } from 'vuex';

import { SearchState } from './state';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { TRACK_QUEUE_ARTWORK_SIZE } from '~/variables';
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
    return state.tracks?.map((track) => {
      const info = {
        type: 'track' as const,
        id: track.id,
        releaseId: track.album.id,
        name: track.name,
        uri: track.uri,
        artworkSrc: getImageSrc(track.album.images, TRACK_QUEUE_ARTWORK_SIZE),
        artistList: track.artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
        hash: `${track.disc_number}-${track.track_number}`,
      };

      return info;
    }) ?? [];
  },

  artists(state) {
    return state.artists?.map((artist) => {
      const info = {
        type: 'artist' as const,
        id: artist.id,
        releaseId: artist.id,
        name: artist.name,
        uri: artist.uri,
        artworkSrc: getImageSrc(artist.images, TRACK_QUEUE_ARTWORK_SIZE),
      };

      return info;
    }) ?? [];
  },

  albums(state) {
    return state.albums?.map((album) => {
      const info = {
        type: 'album' as const,
        id: album.id,
        releaseId: album.id,
        name: album.name,
        uri: album.uri,
        artworkSrc: getImageSrc(album.images, TRACK_QUEUE_ARTWORK_SIZE),
        artistList: album.artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
      };

      return info;
    }) ?? [];
  },

  playlists(state) {
    return state.playlists?.map((playlist) => {
      const info = {
        type: 'playlist' as const,
        id: playlist.id,
        releaseId: playlist.id,
        name: playlist.name,
        uri: playlist.uri,
        artworkSrc: getImageSrc(playlist.images, TRACK_QUEUE_ARTWORK_SIZE),
      };

      return info;
    }) ?? [];
  },

  shows(state) {
    return state.shows?.map((show) => {
      const info = {
        type: 'show' as const,
        id: show.id,
        releaseId: show.id,
        name: show.name,
        uri: show.uri,
        artworkSrc: getImageSrc(show.images, TRACK_QUEUE_ARTWORK_SIZE),
      };

      return info;
    }) ?? [];
  },

  episodes(state) {
    return state.episodes?.map((episode) => {
      const info = {
        type: 'episode' as const,
        id: episode.id,
        releaseId: episode.id,
        name: episode.name,
        uri: episode.uri,
        artworkSrc: getImageSrc(episode.images, TRACK_QUEUE_ARTWORK_SIZE),
      };

      return info;
    }) ?? [];
  },
};

export default getters;
