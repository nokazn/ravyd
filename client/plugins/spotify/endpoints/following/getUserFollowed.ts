import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getUserFollowed = (context: Context) => {
  const { app } = context;

  return ({
    type = 'artist',
    limit,
    after,
  }: {
    type: 'artist'
    limit: number
    after: string
  }): Promise<{ artists: SpotifyAPI.Artist[] } | null> => {
    if (limit < 1 || limit > 50) {
      throw new Error(`limit は1 ~ 50までしか指定できませんが、${limit}と指定されました。`);
    }
    return app.$spotifyApi.$get('/me/following', {
      params: {
        type,
        limit,
        after,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return null;
    });
  };
};
