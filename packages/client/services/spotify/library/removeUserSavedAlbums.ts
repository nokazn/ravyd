import type { Context } from '@nuxt/types';
import { multipleRequestsWithId } from '~/utils/request';

export const removeUserSavedAlbums = (context: Context) => {
  const { app } = context;

  return ({ albumIdList }: { albumIdList: string[] }): Promise<void> => {
    const { length } = albumIdList;
    if (length === 0) {
      return Promise.resolve();
    }

    const request = (ids: string): Promise<void> => {
      return app.$spotifyApi.$delete('/me/albums', {
        params: { ids },
      });
    };
    return multipleRequestsWithId(request, albumIdList, 20);
  };
};
