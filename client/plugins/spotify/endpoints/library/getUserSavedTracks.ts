import { Context } from '@nuxt/types';
import { SpotifyAPI, OneToFifty } from '~~/types';

/**
 * limit は 1~50 までで指定できる
 */
export const getUserSavedTracks = (context: Context) => {
  const { app } = context;

  return ({
    limit = 20,
    offset = 0,
    market,
  }: {
    limit?: OneToFifty
    offset?: number
    market?: SpotifyAPI.Country
  }): Promise<SpotifyAPI.LibraryOf<'track'> | undefined> => {
    const request = app.$spotifyApi.$get('/me/tracks', {
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
