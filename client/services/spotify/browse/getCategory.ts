import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getCategory = (context: Context) => {
  const { app } = context;

  return ({
    categoryId,
    country,
    locale,
  }: {
    categoryId: string
    country?: SpotifyAPI.Country
    locale?: string
  }): Promise<SpotifyAPI.Category | undefined> => {
    const request = app.$spotifyApi.$get(`/browse/categories/${categoryId}`, {
      params: {
        country,
        locale,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });

    return request;
  };
};
