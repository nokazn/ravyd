import { Getters } from 'vuex';

import { SearchState } from './state';
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
      const { id, album: { id: releaseId } } = track;
      const to = {
        path: generatePath(type, releaseId),
        hash: `${track.disc_number}-${track.track_number}`,
      };

      const info = {
        type,
        id,
        releaseId,
        name: track.name,
        uri: track.uri,
        artworkList: track.album.images,
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
      const { id } = artist;
      const to = generatePath(type, id);

      const info = {
        type,
        id,
        releaseId: id,
        name: artist.name,
        uri: artist.uri,
        artworkList: artist.images,
        to,
      };

      return info;
    }) ?? [];
  },

  albums(state) {
    return state.albums?.map((album) => {
      const type = 'album' as const;
      const { id } = album;
      const to = generatePath(type, id);

      const info = {
        type,
        id,
        releaseId: id,
        name: album.name,
        uri: album.uri,
        artworkList: album.images,
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
      const { id } = playlist;
      const to = generatePath(type, id);

      const info = {
        type,
        id,
        releaseId: id,
        name: playlist.name,
        uri: playlist.uri,
        artworkList: playlist.images,
        to,
      };

      return info;
    }) ?? [];
  },

  shows(state) {
    return state.shows?.map((show) => {
      const type = 'show' as const;
      const { id } = show;
      const to = generatePath(type, id);

      const info = {
        type,
        id,
        releaseId: id,
        name: show.name,
        uri: show.uri,
        artworkList: show.images,
        to,
      };

      return info;
    }) ?? [];
  },

  episodes(state) {
    return state.episodes?.map((episode) => {
      const type = 'episode' as const;
      const { id } = episode;
      const to = generatePath(type, id);

      const info = {
        type,
        id,
        releaseId: id,
        name: episode.name,
        uri: episode.uri,
        artworkList: episode.images,
        to,
      };

      return info;
    }) ?? [];
  },
};

export default getters;
