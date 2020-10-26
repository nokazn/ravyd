import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export type Categories = {
  items: SpotifyAPI.Category[];
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

  return {
    items: categories.items,
    hasNext: categories.next != null,
    hasPrevious: categories.previous != null,
  };
};
