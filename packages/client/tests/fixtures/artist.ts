import type { SpotifyAPI } from 'shared/types';

export const minimumArtist = (i: number): Spotify.Artist => ({
  name: `artist${i}`,
  uri: `spotify:artists:artist${i}`,
});

export const simpleArtist = (i: number): SpotifyAPI.SimpleArtist => ({
  external_urls: { spotify: `path/to/spotify/artist${i}` },
  href: `path/to/artist${i}`,
  id: `id${i}`,
  name: `name${i}`,
  type: 'artist',
  uri: `spotify:artist:artist${i}`,
});
