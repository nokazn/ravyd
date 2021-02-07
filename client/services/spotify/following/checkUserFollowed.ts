import type { Context } from '@nuxt/types';
import { multipleRequestsWithId } from '~/utils/request';

export const checkUserFollowed = (context: Context) => {
  const { app } = context;

  return ({
    type,
    idList,
  }: {
    type: 'artist' | 'user';
    idList: string[];
  }): Promise<boolean[]> => {
    const { length } = idList;
    if (length === 0) {
      return Promise.resolve([]);
    }

    const request = (ids: string, l: number) => {
      return app.$spotifyApi.$get<boolean[]>('/me/following/contains', {
        params: {
          type,
          ids,
        },
      }).catch((err: Error) => {
        console.error({ err });
        const isFollowed: boolean[] = new Array(l).fill(false);
        return isFollowed;
      });
    };
    return multipleRequestsWithId(request, idList, 50, (lists) => lists.flat());
  };
};
