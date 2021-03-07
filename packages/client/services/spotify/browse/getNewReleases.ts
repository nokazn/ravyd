import type { Context } from '@nuxt/types';
import type { SpotifyAPI, OneToFifty } from 'shared/types';

type Albums = { albums: SpotifyAPI.Browse.NewReleases };

export const getNewReleases = (context: Context) => {
  const { app } = context;

  return ({
    limit = 20,
    offset = 0,
    country = 'from_token',
  }: {
    limit?: OneToFifty;
    offset?: number;
    country?: SpotifyAPI.Country;
  }): Promise<Partial<Albums>> => {
    return app.$spotifyApi.$get<Albums>('/browse/new-releases', {
      params: {
        country,
        limit,
        offset,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return {};
    });
  };
};
