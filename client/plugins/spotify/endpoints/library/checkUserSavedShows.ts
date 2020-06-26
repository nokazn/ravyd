import { Context } from '@nuxt/types';

export const checkUserSavedShows = (context: Context) => {
  const { app } = context;

  return ({ showIdList }: { showIdList: string[] }): Promise<boolean[]> => {
    const { length } = showIdList;
    const maxLength = 50;
    if (length === 0) {
      return Promise.resolve([]);
    }
    if (length > maxLength) {
      throw new Error(`showIdList は最大${maxLength}個までしか指定できませんが、${length}個指定されました。`);
    }

    const ids = showIdList.join(',');
    return app.$spotifyApi.$get('/me/shows/contains', {
      params: {
        ids,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return new Array(length).fill(false);
    });
  };
};
