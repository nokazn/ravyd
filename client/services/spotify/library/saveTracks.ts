import { Context } from '@nuxt/types';

export const saveTracks = (context: Context) => {
  const { app } = context;

  return ({ trackIdList }: { trackIdList: string[] }): Promise<void> => {
    const { length } = trackIdList;
    if (length === 0) {
      return Promise.resolve();
    }

    const limit = 20;
    const handler = (index: number) => {
      const ids = trackIdList.slice(limit * index, limit).join(',');
      return app.$spotifyApi.$put('/me/tracks', null, {
        params: {
          ids,
        },
      }).catch((err: Error) => {
        console.error({ err });
        throw new Error(err.message);
      });
    };

    const handlerCounts = Math.ceil(length / limit);

    return Promise.all(new Array(handlerCounts)
      .fill(undefined)
      .map((_, i) => handler(i)))
      .then(() => {})
      .catch((err: Error) => {
        console.error({ err });
        throw new Error(err.message);
      });
  };
};
