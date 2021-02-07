import type { Context } from '@nuxt/types';
import type { SpotifyAPI } from 'shared/types';

export const getCategory = (context: Context) => {
  const { app } = context;

  return ({
    categoryId,
    country,
    locale,
  }: {
    categoryId: string;
    country?: SpotifyAPI.Country;
    locale?: string;
  }): Promise<SpotifyAPI.Category | undefined> => {
    return app.$spotifyApi.$get<SpotifyAPI.Category>(`/browse/categories/${categoryId}`, {
      params: {
        country,
        locale,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });
  };
};
