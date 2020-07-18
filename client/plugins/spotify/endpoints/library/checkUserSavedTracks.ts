import { Context } from '@nuxt/types';

export const checkUserSavedTracks = (context: Context) => {
  const { app } = context;

  return ({ trackIdList }: { trackIdList: string[] }): Promise<boolean[]> => {
    const { length } = trackIdList;
    if (length === 0) {
      return Promise.resolve([]);
    }

    const limit = 50;
    const handler = (index: number): Promise<boolean[]> => {
      // limit ごとに分割
      const ids = trackIdList.slice(limit * index, limit).join(',');
      return app.$spotifyApi.$get('/me/tracks/contains', {
        params: {
          ids,
        },
      }).catch((err: Error) => {
        console.error({ err });
        return new Array(length).fill(false);
      });
    };
    const handlerCounts = Math.ceil(length / limit);

    return Promise.all(new Array(handlerCounts)
      .fill(undefined)
      .map((_, i) => handler(i)))
      .then((isSavedLists) => isSavedLists.flat());
  };
};
