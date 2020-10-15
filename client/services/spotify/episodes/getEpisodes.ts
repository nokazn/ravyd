import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getEpisodes = (context: Context) => {
  const { app } = context;

  return ({ episodeIdList, market }: {
    episodeIdList: string[];
    market?: SpotifyAPI.Country;
  }): Promise<{ episodes?: (SpotifyAPI.Episode | null)[] }> => {
    const ids = episodeIdList.join(',');
    return app.$spotifyApi.$get('/episodes/', {
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
