import { Context } from '@nuxt/types';
import { App } from '~~/types';

export const getCategoryList = async (
  { app }: Context,
): Promise<App.CategoryInfo[] | undefined> => {
  const country = app.$getters()['auth/userCountryCode'];
  const { categories } = await app.$spotify.browse.getCategoryList({
    country,
    limit: 30,
  });
  if (categories == null) return undefined;

  const categoryList = categories.items.map((category) => ({
    id: category.id,
    name: category.name,
    images: category.icons,
  }));

  return categoryList;
};
