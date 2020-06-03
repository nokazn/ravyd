import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getCategoryList = (context: Context) => {
  const { app } = context;

  return ({
    country,
    locale,
    limit = 20,
    offset = 0,
  }: {
    country?: SpotifyAPI.Country
    locale?: string
    limit?: number // 1 ~ 50 まで指定できる
    offset?: number
  }): Promise<{ categories: SpotifyAPI.Paging<SpotifyAPI.Category> | undefined }> => {
    if (limit < 1 || limit > 50) {
      throw new Error(`limit は1 ~ 50までしか指定できませんが、${limit}と指定されました。`);
    }

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
