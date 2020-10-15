import { Context } from '@nuxt/types';
import { SpotifyAPI, OneToFifty } from '~~/types';

export const getCategoryList = (context: Context) => {
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
  }): Promise<{ categories: SpotifyAPI.Paging<SpotifyAPI.Category> | undefined }> => {
    return app.$spotifyApi.$get('/browse/categories', {
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
