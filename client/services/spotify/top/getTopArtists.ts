import type { Context } from '@nuxt/types';
import type { SpotifyAPI, OneToFifty } from 'shared/types';

export const getTopArtists = (context: Context) => {
  const { app } = context;

  return ({
    limit = 20,
    offset = 0,
    timeRange = 'short_term',
  }: {
    limit?: OneToFifty;
    offset?: number;
    timeRange?: SpotifyAPI.Browse.TimeRange;
  }): Promise<SpotifyAPI.Paging<SpotifyAPI.Artist> | undefined> => {
    return app.$spotifyApi.$get<SpotifyAPI.Paging<SpotifyAPI.Artist>>('/me/top/artists', {
      params: {
        limit,
        offset,
        time_range: timeRange,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });
  };
};
