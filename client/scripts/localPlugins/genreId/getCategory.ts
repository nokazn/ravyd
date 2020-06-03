import { Context } from '@nuxt/types';
import { App } from '~~/types';

import { getImageSrc } from '~/scripts/converter/getImageSrc';

export const getCategory = async (
  { app, params }: Context,
  artworkSize: number,
): Promise<App.CategoryInfo | null> => {
  const country = app.$getters()['auth/userCountryCode'];
  const categoryInfo = await app.$spotify.browse.getCategory({
    categoryId: params.genreId,
    country,
  });
  if (categoryInfo == null) return null;

  return {
    id: categoryInfo.id,
    name: categoryInfo.name,
    artworkSrc: getImageSrc(categoryInfo.icons, artworkSize),
  };
};
