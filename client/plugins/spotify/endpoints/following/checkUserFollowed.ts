import { Context } from '@nuxt/types';

export const checkUserFollowed = (context: Context) => {
  const { app } = context;

  return ({
    type,
    idList,
  }: {
    type: 'artist' | 'user'
    idList: string[]
  }): Promise<boolean[]> => {
    const { length } = idList;
    if (length === 0) {
      return Promise.resolve([]);
    }

    const limit = 50;
    const handler = (index: number): Promise<boolean[]> => {
      // limit ごとに分割
      const ids = idList.slice(limit * index, limit).join(',');
      return app.$spotifyApi.$get('/me/following/contains', {
        params: {
          type,
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
      .then((isFollowedLists) => isFollowedLists.flat());
  };
};
