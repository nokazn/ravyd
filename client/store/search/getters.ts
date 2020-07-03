import { Getters } from 'vuex';

import { SearchState } from './state';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { TRACK_QUEUE_ARTWORK_SIZE } from '~/variables';
import { App, SpotifyAPI } from '~~/types';

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

const generatePath = (type: SpotifyAPI.SearchType, id: string) => {
  const linkType = {
    album: 'releases',
    artist: 'artists',
    track: 'releases',
    playlist: 'playlists',
    // @todo
    show: 'episodes',
    episode: 'episodes',
  }[type];

  return `/${linkType}/${id}`;
};

const getters: Getters<SearchState, SearchGetters> = {
  tracks(state) {
    return state.tracks?.map((track) => {
      const type = 'track' as const;
      const { id, name, uri } = track;
      const releaseId = track.album.id;
      const to = {
        path: generatePath(type, releaseId),
        hash: `${track.disc_number}-${track.track_number}`,
      };

      const info = {
        type,
        id,
        releaseId,
        name,
        uri,
        artworkSrc: getImageSrc(track.album.images, TRACK_QUEUE_ARTWORK_SIZE),
        artistList: track.artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
        to,
      };

      return info;
    }) ?? [];
  },

  artists(state) {
    return state.artists?.map((artist) => {
      const type = 'artist' as const;
      const { id, name, uri } = artist;
      const to = generatePath(type, id);

      const info = {
        type,
        id,
        releaseId: id,
        name,
        uri,
        artworkSrc: getImageSrc(artist.images, TRACK_QUEUE_ARTWORK_SIZE),
        to,
      };

      return info;
    }) ?? [];
  },

  albums(state) {
    return state.albums?.map((album) => {
      const type = 'album' as const;
      const { id, name, uri } = album;
      const to = generatePath(type, id);

      const info = {
        type,
        id,
        releaseId: id,
        name,
        uri,
        artworkSrc: getImageSrc(album.images, TRACK_QUEUE_ARTWORK_SIZE),
        artistList: album.artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
        to,
      };

      return info;
    }) ?? [];
  },

  playlists(state) {
    return state.playlists?.map((playlist) => {
      const type = 'playlist' as const;
      const { id, name, uri } = playlist;
      const to = generatePath(type, id);

      const info = {
        type,
        id,
        releaseId: id,
        name,
        uri,
        artworkSrc: getImageSrc(playlist.images, TRACK_QUEUE_ARTWORK_SIZE),
        to,
      };

      return info;
    }) ?? [];
  },

  shows(state) {
    return state.shows?.map((show) => {
      const type = 'show' as const;
      const { id, name, uri } = show;
      const to = generatePath(type, id);

      const info = {
        type,
        id,
        releaseId: id,
        name,
        uri,
        artworkSrc: getImageSrc(show.images, TRACK_QUEUE_ARTWORK_SIZE),
        to,
      };

      return info;
    }) ?? [];
  },

  episodes(state) {
    return state.episodes?.map((episode) => {
      const type = 'episode' as const;
      const { id, name, uri } = episode;
      const to = generatePath(type, id);

      const info = {
        type,
        id,
        releaseId: id,
        name,
        uri,
        artworkSrc: getImageSrc(episode.images, TRACK_QUEUE_ARTWORK_SIZE),
        to,
      };

      return info;
    }) ?? [];
  },
};

export default getters;