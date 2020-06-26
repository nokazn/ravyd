import { Context } from '@nuxt/types';

export const checkUserFollowed = (context: Context) => {
  const { app } = context;

  return ({
    type,
    artistIdList,
  }: {
    type: 'artist' | 'user'
    artistIdList: string[]
  }): Promise<boolean[]> => {
    const { length } = artistIdList;
    const maxLength = 50;
    if (length === 0) {
      return Promise.resolve([]);
    }
    if (length > maxLength) {
      throw new Error(`artistIdList は最大${maxLength}個までしか指定できませんが、${length}個指定されました。`);
    }

    const ids = artistIdList.join(',');
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
};
