import { Context } from '@nuxt/types';

export const checkUserSavedAlbums = (context: Context) => {
  const { app } = context;

  return ({ albumIdList }: { albumIdList: string[] }): Promise<boolean[]> => {
    const { length } = albumIdList;
    if (length === 0) {
      return Promise.resolve([]);
    }

    const limit = 50;
    const handler = (index: number): Promise<boolean[]> => {
      // limit ごとに分割
      const ids = albumIdList.slice(limit * index, limit).join(',');
      return app.$spotifyApi.$get('/me/albums/contains', {
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
