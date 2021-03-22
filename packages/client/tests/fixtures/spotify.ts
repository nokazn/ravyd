import type { SpotifyAPI } from 'shared/types';

export const image = (i: number): SpotifyAPI.Image => ({
  url: `path/to/image${i}`,
  height: 500,
  width: 500,
});

export const externalUrls = (i: number) => ({
  spotify: `path/to/spotify${i}`,
});
