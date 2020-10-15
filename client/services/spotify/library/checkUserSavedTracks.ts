import type { Context } from '@nuxt/types';
import { multipleRequestsWithId } from '~/utils/request';

export const checkUserSavedTracks = (context: Context) => {
  const { app } = context;

  return ({ trackIdList }: { trackIdList: string[] }): Promise<boolean[]> => {
    const { length } = trackIdList;
    if (length === 0) {
      return Promise.resolve([]);
    }

    const request = (ids: string) => {
      return app.$spotifyApi.$get<boolean[]>('/me/tracks/contains', {
        params: { ids },
      }).catch((err: Error) => {
        console.error({ err });
        const isSaved: boolean[] = new Array(length).fill(false);
        return isSaved;
      });
    };
    return multipleRequestsWithId(request, trackIdList, 50, (lists) => lists.flat());
  };
};
