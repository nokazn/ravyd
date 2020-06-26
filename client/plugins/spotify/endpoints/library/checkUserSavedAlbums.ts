import { Context } from '@nuxt/types';

export const checkUserSavedAlbums = (context: Context) => {
  const { app } = context;

  return ({ albumIdList }: { albumIdList: string[] }): Promise<boolean[]> => {
    const { length } = albumIdList;
    const maxLength = 50;
    if (length === 0) {
      return Promise.resolve([]);
    }
    if (length > maxLength) {
      throw new Error(`albumIdList は最大${maxLength}個までしか指定できませんが、${length}個指定されました。`);
    }

    const ids = albumIdList.join(',');
    return app.$spotifyApi.$get('/me/albums/contains', {
      params: {
        ids,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return new Array(length).fill(false);
    });
  };
};
