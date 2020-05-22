import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getNewReleases = (context: Context) => {
  const { app } = context;

  return ({
    country,
    limit = 20,
    offset = 0,
  }: {
    country?: SpotifyAPI.Country
    limit?: number // 1 ~ 50 まで指定できる
    offset?: number
  }): Promise<{ albums: SpotifyAPI.Browse.NewReleases } | null> => {
    if (limit < 1 || limit > 50) {
      throw new Error(`limit は1 ~ 50までしか指定できませんが、${limit}と指定されました。`);
    }

    return app.$spotifyApi.$get('/browse/new-releases', {
      params: {
        country,
        limit,
        offset,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return null;
    });
  };
};
