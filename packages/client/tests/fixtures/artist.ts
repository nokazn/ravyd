import type { SpotifyAPI } from 'shared/types';
import { externalUrls } from './spotify';

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
