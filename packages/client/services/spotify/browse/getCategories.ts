import type { Context } from '@nuxt/types';
import type { SpotifyAPI, OneToFifty } from 'shared/types';

type Categories = { categories: SpotifyAPI.Paging<SpotifyAPI.Category> };

export const getCategories = (context: Context) => {
  const { app } = context;

  return ({
    limit = 20,
    offset = 0,
    country = 'from_token',
    locale,
  }: {
    limit?: OneToFifty;
    offset?: number;
    country?: SpotifyAPI.Country;
    locale?: string;
  }): Promise<Partial<Categories>> => {
    return app.$spotifyApi.$get<Categories>('/browse/categories', {
      params: {
        country,
        locale,
        limit,
        offset,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return {};
    });
  };
};
