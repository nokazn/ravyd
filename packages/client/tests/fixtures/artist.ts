import type { SpotifyAPI } from 'shared/types';
import { externalUrls, image, followers } from './spotify';

interface ArtistParams {
  followers?: number;
}

export const minimumArtist = (i: number): Spotify.Artist => ({
  name: `artist${i}`,
  uri: `spotify:artists:artist${i}`,
});

export const simpleArtist = (i: number): SpotifyAPI.SimpleArtist => ({
  ...minimumArtist(i),
  external_urls: externalUrls(i),
  href: `path/to/artist${i}`,
  id: `id${i}`,
  type: 'artist',
});

export const artist = (i: number, params?: ArtistParams): SpotifyAPI.Artist => ({
  followers: followers(params?.followers ?? 10),
  genres: ['art pop', 'indie pop'],
  images: [image(1)],
  popularity: 50,
  ...simpleArtist(i),
});
