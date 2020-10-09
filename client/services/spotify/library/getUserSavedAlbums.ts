import { Context } from '@nuxt/types';
import { SpotifyAPI, OneToFifty } from '~~/types';

export const getUserSavedAlbums = (context: Context) => {
  const { app } = context;

  return ({
    limit = 20,
    offset = 0,
    market,
  }: {
    limit?: OneToFifty
    offset?: number
    market?: SpotifyAPI.Country
  }): Promise<SpotifyAPI.LibraryOf<'album'> | undefined> => {
    const request = app.$spotifyApi.$get('/me/albums', {
      params: {
        limit,
        offset,
        market,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });

    return request;
  };
};
