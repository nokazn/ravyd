import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

type SimpleShows = { shows: (SpotifyAPI.SimpleShow | null)[] };

export const getShows = (context: Context) => {
  const { app } = context;

  return ({ showIdList, market }: {
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
