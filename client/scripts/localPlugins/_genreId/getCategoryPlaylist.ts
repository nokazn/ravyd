import { Context } from '@nuxt/types';
import { App } from '~~/types';

import { convertPlaylistForCard } from '~/scripts/converter/convertPlaylistForCard';

export const getCategoryPlaylist = async (
  { app, params }: Context,
  limit: number,
): Promise<App.PlaylistCardInfo[] | null> => {
  const country = app.$getters()['auth/userCountryCode'];
  const { playlists } = await app.$spotify.browse.getCategoryPlaylist({
    categoryId: params.genreId,
    country,
    limit,
  });
  if (playlists == null) return null;

  return playlists.items.map(convertPlaylistForCard);
};
