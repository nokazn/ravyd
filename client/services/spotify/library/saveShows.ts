import type { Context } from '@nuxt/types';
import { multipleRequestsWithId } from '~/utils/request';

export const saveShows = (context: Context) => {
  const { app } = context;

  return ({ showIdList }: { showIdList: string[] }): Promise<void> => {
    const { length } = showIdList;
    if (length === 0) {
      return Promise.resolve();
    }

    const request = (ids: string) => {
      return app.$spotifyApi.$put<void>('/me/shows', null, {
        params: { ids },
      });
    };
    return multipleRequestsWithId(request, showIdList, 20);
  };
};
