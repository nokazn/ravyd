import type { SpotifyAPI } from 'shared/types';
import { simpleArtist } from './artist';
import {
  image,
  externalUrls,
  paging,
  copyright,
} from './spotify';

export const simpleAlbum = (i: number, l: number = 1): SpotifyAPI.SimpleAlbum => ({
  available_markets: ['JP'],
  album_type: 'album',
  artists: [...new Array(l)].map((_, j) => simpleArtist(j)),
  copyrights: [copyright(1)],
  external_urls: externalUrls(i),
  href: `path/to/album${i}`,
  id: `id${i}`,
  images: [image(i)],
  name: `name${i}`,
  release_date: '2021-03-22',
  release_date_precision: 'day',
  restriction: {},
  type: 'album',
  uri: `spotify:album:album${i}`,
});

export const album = (i: number, l: number = 1): SpotifyAPI.Album => {
  const items: SpotifyAPI.SimpleTrack[] = [];
  return {
    ...simpleAlbum(i, l),
    external_ids: {},
    genres: ['art pop', 'indie pop'],
    label: '4AD',
    popularity: 80,
    tracks: paging(items),
    total_tracks: items.length,
  };
};
