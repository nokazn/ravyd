import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getShows = (context: Context) => {
  const { app } = context;

  return ({ showIdList, market }: {
    showIdList: string[];
    market?: SpotifyAPI.Country;
  }): Promise<{ shows?: (SpotifyAPI.SimpleShow | null)[] }> => {
    const ids = showIdList.join(',');
    return app.$spotifyApi.$get('/shows/', {
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
