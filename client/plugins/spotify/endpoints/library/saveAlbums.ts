import { Context } from '@nuxt/types';

export const saveAlbums = (context: Context) => {
  const { app } = context;

  return ({ albumIdList }: { albumIdList: string[] }): Promise<void> => {
    const { length } = albumIdList;
    const minLength = 1;
    const maxLength = 20;
    if (minLength < length || length > maxLength) {
      throw new Error(`albumIdList は${minLength}~${maxLength}個しか指定できませんが、${length}個指定されました。`);
    }

    const ids = albumIdList.join(',');
    return app.$spotifyApi.$put('/me/albums', null, {
      params: {
        ids,
      },
    }).catch((err: Error) => {
      console.error({ err });
      throw new Error(err.message);
    });
  };
};
