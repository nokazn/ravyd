import type { Context } from '@nuxt/types';
import { multipleRequestsWithId } from '~/utils/request';

export const checkUserSavedAlbums = (context: Context) => {
  const { app } = context;

  return ({ albumIdList }: { albumIdList: string[] }): Promise<boolean[]> => {
    const { length } = albumIdList;
    if (length === 0) {
      return Promise.resolve([]);
    }

    const request = (ids: string) => {
      return app.$spotifyApi.$get<boolean[]>('/me/albums/contains', {
        params: { ids },
      }).catch((err: Error) => {
        console.error({ err });
        const isSaved: boolean[] = new Array(length).fill(false);
        return isSaved;
      });
    };
    return multipleRequestsWithId(request, albumIdList, 50, (lists) => lists.flat());
  };
};
