import { Context } from '@nuxt/types';
import { App } from '~~/types';

export const getCategory = async (
  { app, params }: Context,
): Promise<App.CategoryInfo | undefined> => {
  const country = app.$getters()['auth/userCountryCode'];
  const categoryInfo = await app.$spotify.browse.getCategory({
    categoryId: params.genreId,
    country,
  });
  if (categoryInfo == null) return undefined;

  return {
    id: categoryInfo.id,
    name: categoryInfo.name,
    artworkList: categoryInfo.icons,
  };
};