import type { Context } from '@nuxt/types';
import type { OneToFifty, SpotifyAPI } from 'shared/types';

export type Feature = {
  message: string | undefined;
  items: SpotifyAPI.SimplePlaylist[];
  hasNext: boolean;
  hasPrevious: boolean;
}

export const getFeaturedPlaylists = async (
  { app }: Context,
  params?: {
    offset?: number;
    limit: OneToFifty;
  },
): Promise<Feature | undefined> => {
  const country = app.$getters()['auth/userCountryCode'];
  const { playlists, message } = await app.$spotify.browse.getFeaturedPlaylists({
    country,
    limit: params?.limit ?? 50,
    offset: params?.offset,
  });
  if (playlists == null) return undefined;

  return {
    message,
    items: playlists.items,
    hasNext: playlists.next != null,
    hasPrevious: playlists.previous != null,
  };
};
