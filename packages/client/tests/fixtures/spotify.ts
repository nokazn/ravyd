import type { SpotifyAPI } from 'shared/types';

export const image = (i: number, l: number = 500): SpotifyAPI.Image => ({
  url: `path/to/image${i}`,
  height: l,
  width: l,
});

export const externalUrls = (i: number) => ({
  spotify: `path/to/spotify${i}`,
});

export const resumePoint = (fully_played: boolean, resume_position_ms: number): SpotifyAPI.ResumePoint => ({
  fully_played,
  resume_position_ms,
});

export const copyright = (i: number): SpotifyAPI.Copyright => ({
  text: `copyright${i}`,
  type: 'C',
});

export const followers = (total: number): SpotifyAPI.Followers => ({
  href: 'path/to/followers',
  total,
});

export const paging = <I>(items: I[]): SpotifyAPI.Paging<I> => ({
  href: 'path/to/items',
  items,
  limit: 50,
  next: null,
  offset: 0,
  previous: null,
  total: items.length,
});
