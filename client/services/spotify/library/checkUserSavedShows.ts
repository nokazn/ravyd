import type { Context } from '@nuxt/types';
import { multipleRequestsWithId } from '~/utils/request';

export const checkUserSavedShows = (context: Context) => {
  const { app } = context;

  return ({ showIdList }: { showIdList: string[] }): Promise<boolean[]> => {
    const { length } = showIdList;
    if (length === 0) {
      return Promise.resolve([]);
    }

    const request = (ids: string, l: number) => {
      return app.$spotifyApi.$get<boolean[]>('/me/shows/contains', {
        params: { ids },
      }).catch((err: Error) => {
        console.error({ err });
        const isSaved: boolean[] = new Array(l).fill(false);
        return isSaved;
      });
    };
    return multipleRequestsWithId(request, showIdList, 50, (lists) => lists.flat());
  };
};
