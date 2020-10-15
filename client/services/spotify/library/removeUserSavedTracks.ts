import { Context } from '@nuxt/types';

export const removeUserSavedTracks = (context: Context) => {
  const { app } = context;

  return ({ trackIdList }: { trackIdList: string[] }): Promise<void> => {
    const { length } = trackIdList;
    if (length === 0) {
      return Promise.resolve();
    }

    const limit = 20;
    const handler = (index: number) => {
      // limit ごとに分割
      const ids = trackIdList.slice(limit * index, limit).join(',');
      return app.$spotifyApi.$delete('/me/tracks', {
        params: {
          ids,
        },
      });
    };
    const handlerCounts = Math.ceil(length / limit);

    return Promise.all(new Array(handlerCounts)
      .fill(undefined)
      .map((_, i) => handler(i)))
      .then(() => {})
      .catch((err: Error) => {
        console.error({ err });
        throw err;
      });
  };
};
