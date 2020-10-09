import { Context } from '@nuxt/types';

export const follow = (context: Context) => {
  const { app } = context;

  return ({ type, idList }: {
    type: 'artist' | 'user'
    idList: string[]
  }): Promise<void> => {
    const { length } = idList;
    if (length === 0) {
      return Promise.resolve();
    }

    const limit = 50;
    const handler = (index: number): Promise<void> => {
      // limit ごとに分割
      const ids = idList.slice(limit * index, limit).join(',');
      return app.$spotifyApi.$put('/me/following', null, {
        params: {
          type,
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
        throw new Error(err.message);
      });
  };
};
