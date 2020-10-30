import { Context } from '@nuxt/types';
import { OneToFifty, SpotifyAPI } from '~~/types';

export type Categories = {
  items: SpotifyAPI.Category[];
  hasNext: boolean;
  hasPrevious: boolean;
}

export const getCategories = async (
  { app }: Context,
  params?: {
    offset?: number;
    limit: OneToFifty;
  },
): Promise<Categories | undefined> => {
  const country = app.$getters()['auth/userCountryCode'];
  const { categories } = await app.$spotify.browse.getCategories({
    country,
    limit: params?.limit ?? 50,
    offset: params?.offset,
  });
  if (categories == null) return undefined;

  return {
    items: categories.items,
    hasNext: categories.next != null,
    hasPrevious: categories.previous != null,
  };
};
