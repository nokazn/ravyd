import type { SpotifyAPI } from 'shared/types';
import { externalUrls, followers, image } from './spotify';

interface UserParams {
  followers?: number;
  product?: SpotifyAPI.User['product'];
}

export const user = (i: number, params?: UserParams): SpotifyAPI.User => ({
  country: 'JP',
  display_name: `user${i}`,
  email: `user${i}@email.com`,
  explicit_content: {
    filter_enabled: false,
    filter_locked: false,
  },
  followers: followers(params?.followers ?? 10),
  external_urls: externalUrls(i),
  href: `/path/to/user${i}`,
  id: `id${i}`,
  images: [image(i)],
  product: params?.product ?? 'premium',
  type: 'user',
  uri: `uri${i}`,
});
