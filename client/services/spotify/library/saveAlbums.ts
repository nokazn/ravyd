import { Context } from '@nuxt/types';

export const saveAlbums = (context: Context) => {
  const { app } = context;

  return ({ albumIdList }: { albumIdList: string[] }): Promise<void> => {
    const { length } = albumIdList;
    if (length === 0) {
      return Promise.resolve();
    }

    const limit = 20;
    const handler = (index: number) => {
      const ids = albumIdList.slice(limit * index, limit).join(',');
      return app.$spotifyApi.$put('/me/albums', null, {
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
