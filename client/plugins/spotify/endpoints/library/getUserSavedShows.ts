import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getUserSavedShows = (context: Context) => {
  const { app } = context;

  return ({
    limit = 20,
    offset = 0,
    market,
  }: {
    limit?: number
    offset?: number
    market?: SpotifyAPI.Market
  }): Promise<SpotifyAPI.LibraryOf<'show'> | null> => {
    if (limit < 1 || limit > 50) {
      throw new Error(`limit は1 ~ 50までしか指定できませんが、${limit}と指定されました。`);
    }

    return app.$spotifyApi.$get('/me/shows', {
      params: {
        limit,
        offset,
        market,
      },
    })
      .catch((err: Error) => {
        console.error({ err });
        return null;
      });
  };
};
