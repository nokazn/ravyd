import { Context } from '@nuxt/types';
import { SpotifyAPI, OneToFifty } from '~~/types';

export const getNewReleases = (context: Context) => {
  const { app } = context;

  return ({
    country,
    limit = 20,
    offset = 0,
  }: {
    country?: SpotifyAPI.Country
    limit?: OneToFifty
    offset?: number
  }): Promise<{ albums: SpotifyAPI.Browse.NewReleases | undefined }> => {
    const request = app.$spotifyApi.$get('/browse/new-releases', {
      params: {
        country,
        limit,
        offset,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return {};
    });

    return request;
  };
};