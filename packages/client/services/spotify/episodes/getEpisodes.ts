import type { Context } from '@nuxt/types';

import type { SpotifyAPI } from 'shared/types';
import { multipleRequestsWithId } from '~/utils/request';

type Episodes = { episodes: (SpotifyAPI.Episode | null)[] };

export const getEpisodes = (context: Context) => {
  const { app } = context;

  return ({ episodeIdList, market = 'from_token' }: {
    episodeIdList: string[];
    market?: SpotifyAPI.Country;
  }): Promise<Episodes['episodes']> => {
    const request = (ids: string, l: number) => {
      return app.$spotifyApi.$get<Episodes>('/episodes/', {
        params: {
          ids,
          market,
        },
      })
        .then(({ episodes }) => episodes)
        .catch((err: Error) => {
          console.error({ err });
          const episodeList: Episodes['episodes'] = new Array(l).fill(null);
          return episodeList;
        });
    };

    return multipleRequestsWithId(request, episodeIdList, 50, (lists) => lists.flat());
  };
};
