import { Context } from '@nuxt/types';

export const checkUserSavedShows = (context: Context) => {
  const { app } = context;

  return ({ showIdList }: { showIdList: string[] }): Promise<boolean[]> => {
    const { length } = showIdList;
    if (length === 0) {
      return Promise.resolve([]);
    }

    const limit = 50;
    const handler = (index: number): Promise<boolean[]> => {
      // limit ごとに分割
      const ids = showIdList.slice(limit * index, limit).join(',');
      return app.$spotifyApi.$get('/me/shows/contains', {
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
