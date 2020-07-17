import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getUserSavedAlbums = (context: Context) => {
  const { app } = context;

  return ({
    limit = 20,
    offset = 0,
    market,
  }: {
    limit?: number
    offset?: number
    market?: SpotifyAPI.Country
  }): Promise<SpotifyAPI.LibraryOf<'album'> | undefined> => {
    if (limit < 1 || limit > 50) {
      throw new Error(`limit は1 ~ 50までしか指定できませんが、${limit}と指定されました。`);
    }

    return app.$spotifyApi.$get('/me/albums', {
      params: {
        limit,
        offset,
        market,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });
  };
};
