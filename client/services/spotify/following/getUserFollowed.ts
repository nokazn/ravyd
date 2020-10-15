import { Context } from '@nuxt/types';
import { SpotifyAPI, OneToFifty } from '~~/types';

export const getUserFollowed = (context: Context) => {
  const { app } = context;

  return ({
    type = 'artist',
    limit,
    after,
  }: {
    type: 'artist';
    limit?: OneToFifty;
    after?: string;
  }): Promise<{ artists: SpotifyAPI.Paging<SpotifyAPI.Artist> | undefined}> => {
    return app.$spotifyApi.$get('/me/following', {
      params: {
        type,
        limit,
        after,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return {};
    });
  };
};
