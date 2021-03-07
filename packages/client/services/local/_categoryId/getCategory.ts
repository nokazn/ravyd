import type { Context } from '@nuxt/types';
import type { SpotifyAPI } from 'shared/types';

export const getCategory = async (
  { app, params }: Context,
): Promise<SpotifyAPI.Category | undefined> => {
  const category = await app.$spotify.browse.getCategory({
    categoryId: params.categoryId,
  });
  return category;
};
