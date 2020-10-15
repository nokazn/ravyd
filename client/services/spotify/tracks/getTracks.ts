import type { Context } from '@nuxt/types';

import { multipleRequestsWithId } from '~/utils/request';
import type { SpotifyAPI } from '~~/types';

type Tracks = { tracks: (SpotifyAPI.Track | null)[] };

export const getTracks = (context: Context) => {
  const { app } = context;

  // trackIdList は50個まで
  return ({
    market,
    trackIdList,
  }: {
    market?: SpotifyAPI.Country;
    trackIdList: string[];
  }): Promise<Tracks['tracks']> => {
    const request = (ids: string, l: number) => {
      return app.$spotifyApi.$get<Tracks>('/tracks', {
        params: {
          market,
          ids,
        },
      })
        .then(({ tracks }) => tracks)
        .catch((err: Error) => {
          console.error({ err });
          const trackList: Tracks['tracks'] = new Array(l).fill(null);
          return trackList;
        });
    };
    return multipleRequestsWithId(request, trackIdList, 50, (lists) => lists.flat());
  };
};
