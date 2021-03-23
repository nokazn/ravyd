import type { SpotifyAPI } from 'shared/types';
import { episode } from './episode';
import {
  externalUrls,
  image,
  copyright,
  paging,
} from './spotify';

export const simpleShow = (i: number, total_episodes: number = 3): SpotifyAPI.SimpleShow => ({
  available_markets: ['JP'],
  copyrights: [copyright(1), copyright(2)],
  description: `description${i}`,
  explicit: false,
  external_urls: externalUrls(i),
  href: `path/to/show${i}`,
  id: `id${i}`,
  images: [image(1)],
  is_externally_hosted: false,
  languages: ['JP'],
  media_type: 'audio',
  name: `name${i}`,
  publisher: `publisher${i}`,
  type: 'show',
  total_episodes,
  uri: `uri${i}`,
});

export const show = (i: number): SpotifyAPI.Show => ({
  ...simpleShow(i, 3),
  episodes: paging([...new Array(3)].map((_, j) => episode(j))),
});
