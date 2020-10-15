import type { Context } from '@nuxt/types';
import { multipleRequestsWithId } from '~/utils/request';

export const saveAlbums = (context: Context) => {
  const { app } = context;

  return ({ albumIdList }: { albumIdList: string[] }): Promise<void> => {
    const { length } = albumIdList;
    if (length === 0) {
      return Promise.resolve();
    }

    const request = (ids: string) => {
      return app.$spotifyApi.$put<void>('/me/albums', null, {
        params: { ids },
      });
    };
    return multipleRequestsWithId(request, albumIdList, 20);
  };
};
