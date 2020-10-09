import { Context } from '@nuxt/types';

import { convertToContentListItem } from '~/utils/converter';
import { App } from '~~/types';

export const getRelatedArtistList = async (
  { app, params }: Context,
): Promise<App.ContentItemInfo<'artist'>[]> => {
  const { artistId } = params;
  const { artists } = await app.$spotify.artists.getRelatedArtists({ artistId });
  return artists?.map(convertToContentListItem('artist')) ?? [];
};
