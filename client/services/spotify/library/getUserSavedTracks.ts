import type { Context } from '@nuxt/types';
import type { SpotifyAPI, OneToFifty } from 'shared/types';

export const getUserSavedTracks = (context: Context) => {
  const { app } = context;

  return ({
    limit = 20,
    offset = 0,
    market,
  }: {
    limit?: OneToFifty;
    offset?: number;
    market?: SpotifyAPI.Country;
  }): Promise<SpotifyAPI.LibraryOf<'track'> | undefined> => {
    return app.$spotifyApi.$get<SpotifyAPI.LibraryOf<'track'>>('/me/tracks', {
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
