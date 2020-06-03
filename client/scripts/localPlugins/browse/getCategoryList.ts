import { Context } from '@nuxt/types';
import { App } from '~~/types';

import { getImageSrc } from '~/scripts/converter/getImageSrc';

export const getCategoryList = async (
  { app }: Context,
  artworkSize: number,
): Promise<App.CategoryInfo[] | null> => {
  const country = app.$getters()['auth/userCountryCode'];
  const { categories } = await app.$spotify.browse.getCategoryList({
    country,
    limit: 30,
  });
  if (categories == null) return null;

  const categoryList = categories.items.map((category) => ({
    id: category.id,
    name: category.name,
    artworkSrc: getImageSrc(category.icons, artworkSize),
  }));

  return categoryList;
};
