import { Context } from '@nuxt/types';

export const saveTracks = (context: Context) => {
  const { app } = context;

  return ({ trackIdList }: { trackIdList: string[] }): Promise<void> => {
    const { length } = trackIdList;
    const maxLength = 20;
    if (length > maxLength) {
      throw new Error(`trackIdList は最大${maxLength}個までしか指定できませんが、${length}個指定されました。`);
    }

    const ids = trackIdList.join(',');
    return app.$spotifyApi.$put('/me/albums', null, {
      params: {
        ids,
      },
    })
      .catch((err: Error) => {
        console.error({ err });
      });
  };
};
