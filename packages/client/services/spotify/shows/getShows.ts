import type { Context } from '@nuxt/types';
import type { SpotifyAPI } from 'shared/types';

type SimpleShows = { shows: (SpotifyAPI.SimpleShow | null)[] };

export const getShows = (context: Context) => {
  const { app } = context;

  return ({ showIdList, market = 'from_token' }: {
    showIdList: string[];
    market?: SpotifyAPI.Country;
  }): Promise<Partial<SimpleShows>> => {
    const ids = showIdList.join(',');
    return app.$spotifyApi.$get<SimpleShows>('/shows/', {
      params: {
        ids,
        market,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return {};
    });
  };
};
