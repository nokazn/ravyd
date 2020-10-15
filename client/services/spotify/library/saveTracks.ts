import { Context } from '@nuxt/types';
import { multipleRequestsWithId } from '~/utils/request';

export const saveTracks = (context: Context) => {
  const { app } = context;

  return ({ trackIdList }: { trackIdList: string[] }): Promise<void> => {
    const { length } = trackIdList;
    if (length === 0) {
      return Promise.resolve();
    }

    const handler = (ids: string) => {
      return app.$spotifyApi.$put<void>('/me/tracks', null, {
        params: { ids },
      });
    };
    return multipleRequestsWithId(handler, trackIdList, 20);
  };
};
