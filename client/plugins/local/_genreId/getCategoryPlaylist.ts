import { Context } from '@nuxt/types';
import { App, OneToFifty } from '~~/types';

import { convertPlaylistForCard } from '~/utils/converter/convertPlaylistForCard';

export const getCategoryPlaylist = async (
  { app, params }: Context,
  limit: OneToFifty,
): Promise<App.PlaylistCardInfo[]> => {
  const country = app.$getters()['auth/userCountryCode'];
  const { playlists } = await app.$spotify.browse.getCategoryPlaylist({
    categoryId: params.genreId,
    country,
    limit,
  });
  if (playlists == null) return [];

  return playlists.items.map(convertPlaylistForCard);
};
