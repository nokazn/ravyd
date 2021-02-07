import type { Context } from '@nuxt/types';
import type { SpotifyAPI, OneToFifty } from 'shared/types';

export type CategoryPlaylists = {
  items: SpotifyAPI.SimplePlaylist[];
  hasNext: boolean;
  hasPrevious: boolean;
}

export const getCategoryPlaylists = async (
  { app, params }: Context,
  limit: OneToFifty,
): Promise<CategoryPlaylists> => {
  const country = app.$getters()['auth/userCountryCode'];
  const { playlists } = await app.$spotify.browse.getCategoryPlaylists({
    categoryId: params.categoryId,
    country,
    limit,
  });

  if (playlists == null) {
    return {
      items: [],
      hasNext: false,
      hasPrevious: false,
    };
  }

  return {
    items: playlists.items,
    hasNext: playlists.next != null,
    hasPrevious: playlists.previous != null,
  };
};
