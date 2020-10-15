import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getShow = (context: Context) => {
  const { app } = context;

  return ({ showId, market }: {
    showId: string;
    market?: SpotifyAPI.Country;
  }): Promise<SpotifyAPI.Show | undefined> => {
    return app.$spotifyApi.$get(`/shows/${showId}`, {
      params: {
        market,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });
  };
};
