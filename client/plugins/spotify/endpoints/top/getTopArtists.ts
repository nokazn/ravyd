import { Context } from '@nuxt/types';
import { SpotifyAPI, OneToFifty } from '~~/types';

export const getTopArtists = (context: Context) => {
  const { app } = context;

  return ({
    limit = 20,
    offset = 0,
    timeRange = 'medium_term',
  }: {
    limit?: OneToFifty
    offset?: number
    timeRange?: 'long_term' | 'medium_term' | 'short_term'
  }): Promise<SpotifyAPI.Paging<SpotifyAPI.Artist> | undefined> => {
    const request = app.$spotifyApi.$get('/me/top/artists', {
      params: {
        limit,
        offset,
        time_range: timeRange,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });

    return request;
  };
};
