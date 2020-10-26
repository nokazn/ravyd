import { Context } from '@nuxt/types';
import { App } from '~~/types';

export type Categories = {
  items: App.CategoryPage[];
  hasNext: boolean;
  hasPrevious: boolean;
}

export const getCategories = async (
  { app }: Context,
): Promise<Categories | undefined> => {
  const country = app.$getters()['auth/userCountryCode'];
  const { categories } = await app.$spotify.browse.getCategories({
    country,
    limit: 30,
  });
  if (categories == null) return undefined;

  const items = categories.items.map((category) => ({
    id: category.id,
    name: category.name,
    images: category.icons,
  }));

  return {
    items,
    hasNext: categories.next != null,
    hasPrevious: categories.previous != null,
  };
};
