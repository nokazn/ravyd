import type { Context } from '@nuxt/types';
import { convertToContentListItem } from '~/services/converter';
import type { App } from '~/entities';

export const getRelatedArtistList = async (
  { app, params }: Context,
): Promise<App.ContentItem<'artist'>[]> => {
  const { artistId } = params;
  const { artists } = await app.$spotify.artists.getRelatedArtists({ artistId });
  return artists?.map(convertToContentListItem('artist')) ?? [];
};
