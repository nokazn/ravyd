import type { Context } from '@nuxt/types';
import type { SpotifyAPI, OneToFifty } from 'shared/types';

export const getShowEpisodes = (context: Context) => {
  const { app } = context;

  return ({
    showId,
    market,
    limit = 20,
    offset = 0,
  }: {
    showId: string;
    limit?: OneToFifty;
    offset?: number;
    market?: SpotifyAPI.Country;
  }): Promise<SpotifyAPI.Paging<SpotifyAPI.SimpleEpisode> | undefined> => {
    return app.$spotifyApi.$get<SpotifyAPI.Paging<SpotifyAPI.SimpleEpisode>>(`/shows/${showId}/episodes`, {
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
