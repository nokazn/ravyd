import { Context } from '@nuxt/types';
import { multipleRequestsWithId } from '~/utils/request';

export const removeUserSavedTracks = (context: Context) => {
  const { app } = context;

  return ({ trackIdList }: { trackIdList: string[] }): Promise<void> => {
    const { length } = trackIdList;
    if (length === 0) {
      return Promise.resolve();
    }

    const request = (ids: string) => {
      return app.$spotifyApi.$delete<void>('/me/tracks', {
        params: { ids },
      });
    };
    return multipleRequestsWithId(request, trackIdList, 20);
  };
};
