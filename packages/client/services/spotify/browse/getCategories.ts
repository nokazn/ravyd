import type { Context } from '@nuxt/types';
import type { SpotifyAPI, OneToFifty } from 'shared/types';

type Categories = { categories: SpotifyAPI.Paging<SpotifyAPI.Category> };

export const getCategories = (context: Context) => {
  const { app } = context;

  return ({
    country,
    locale,
    limit = 20,
    offset = 0,
  }: {
    country?: SpotifyAPI.Country;
    locale?: string;
    limit?: OneToFifty;
    offset?: number;
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
