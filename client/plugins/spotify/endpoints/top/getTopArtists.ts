import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getTopArtists = (context: Context) => {
  const { app } = context;

  return ({
    limit = 20,
    offset = 0,
    timeRange = 'medium_term',
  }: {
    limit?: number // 1 ~ 50 まで指定できる
    offset?: number
    timeRange?: 'long_term' | 'medium_term' | 'short_term'
  }): Promise<SpotifyAPI.Paging<SpotifyAPI.Artist> | null> => {
    if (limit < 1 || limit > 50) {
      throw new Error(`limit は1 ~ 50までしか指定できませんが、${limit}と指定されました。`);
    }

    return app.$spotifyApi.$get('/me/top/artists', {
      params: {
        limit,
        offset,
        time_range: timeRange,
      },
    })
      .catch((err: Error) => {
        console.error({ err });
        return null;
      });
  };
};
