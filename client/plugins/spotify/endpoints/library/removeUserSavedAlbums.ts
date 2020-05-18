import { Context } from '@nuxt/types';

export const removeUserSavedAlbums = (context: Context) => {
  const { app } = context;

  return ({ albumIdList }: { albumIdList: string[] }): Promise<void> => {
    const { length } = albumIdList;
    const maxLength = 20;
    if (length > maxLength) {
      throw new Error(`albumIdList は最大${maxLength}個までしか指定できませんが、${length}個指定されました。`);
    }

    const ids = albumIdList.join(',');
    return app.$spotifyApi.$delete('/me/albums', {
      params: {
        ids,
      },
    })
      .catch((err: Error) => {
        console.error({ err });
      });
  };
};
