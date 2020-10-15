import type { Context } from '@nuxt/types';

import { multipleRequestsWithId } from '~/utils/request';
import type { SpotifyAPI } from '~~/types';


type Albums = { albums: (SpotifyAPI.Album | null)[]};

export const getAlbums = (context: Context) => {
  const { app } = context;

  /**
   * albumIdList はの長さは最大 20
   */
  return ({ albumIdList, market }: {
    albumIdList: string[];
    market?: SpotifyAPI.Country;
  }): Promise<Albums['albums']> => {
    const request = (ids: string, l: number) => {
      return app.$spotifyApi.$get<Albums>('/albums', {
        params: {
          ids,
          market,
        },
      })
        .then(({ albums }) => albums)
        .catch((err: Error) => {
          console.error({ err });
          const albums: Albums['albums'] = new Array(l).fill(null);
          return albums;
        });
    };
    return multipleRequestsWithId(request, albumIdList, 20, (lists) => lists.flat());
  };
};
