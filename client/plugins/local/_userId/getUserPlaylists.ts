import { Context } from '@nuxt/types';

import { convertPlaylistForCard } from '~/scripts/converter/convertPlaylistForCard';
import { OneToFifty, App } from '~~/types';

export const getUserPlaylists = async (
  { app, params }: Context,
  { limit, offset = 0 }: { limit: OneToFifty, offset?: number },
): Promise<App.UserPlaylistInfo> => {
  const playlists = await app.$spotify.playlists.getListOfUserPlaylist({
    userId: params.userId,
    limit,
    offset,
  });
  if (playlists == null) {
    return {
      playlists: [],
      hasNext: false,
      total: 0,
    };
  }

  return {
    playlists: playlists.items.map(convertPlaylistForCard),
    hasNext: playlists.next != null,
    total: playlists.total,
  };
};
