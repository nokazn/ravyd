import type { Context } from '@nuxt/types';
import type { OneToFifty, SpotifyAPI } from 'shared/types';

export type UserPlaylists = {
  items: SpotifyAPI.SimplePlaylist[];
  hasNext: boolean;
  hasPrevious: boolean;
  total: number;
}

export const getUserPlaylists = async (
  { app, params }: Context,
  { limit, offset = 0 }: {
    limit: OneToFifty;
    offset?: number;
  },
): Promise<UserPlaylists> => {
  const playlists = await app.$spotify.playlists.getListOfUserPlaylist({
    userId: params.userId,
    limit,
    offset,
  });
  if (playlists == null) {
    return {
      items: [],
      hasNext: false,
      hasPrevious: false,
      total: 0,
    };
  }

  return {
    items: playlists.items,
    hasNext: playlists.next != null,
    hasPrevious: playlists.previous != null,
    total: playlists.total,
  };
};
