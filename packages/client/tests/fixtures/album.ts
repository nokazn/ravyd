import type { SpotifyAPI } from 'shared/types';
import { simpleArtist, image, externalUrls } from './index';

export const simpleAlbum = (i: number, l: number = 1): SpotifyAPI.SimpleAlbum => ({
  available_markets: ['JP'],
  album_type: 'album',
  artists: new Array(l).fill(undefined).map((_, j) => simpleArtist(j)),
  copyrights: [{
    type: 'C',
    text: 'copyright',
  }],
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
    tracks: {
      href: `path/to/album${i}/tracks`,
      items,
      limit: 50,
      next: null,
      offset: 0,
      previous: null,
      total: items.length,
    },
    total_tracks: items.length,
  };
};
