import { Context } from '@nuxt/types';
import { SpotifyAPI, OneToFifty } from '~~/types';

type Albums = { albums: SpotifyAPI.Browse.NewReleases };

export const getNewReleases = (context: Context) => {
  const { app } = context;

  return ({
    country,
    limit = 20,
    offset = 0,
  }: {
    country?: SpotifyAPI.Country;
    limit?: OneToFifty;
    offset?: number;
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
