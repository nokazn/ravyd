import { Context } from '@nuxt/types';

export const checkUserSavedTracks = (context: Context) => {
  const { app } = context;

  return ({ trackIdList }: { trackIdList: string[] }): Promise<boolean[]> => {
    const { length } = trackIdList;
    const maxLength = 50;
    if (length > maxLength) {
      throw new Error(`trackIdList は最大${maxLength}個までしか指定できませんが、${length}個指定されました。`);
    }

    const ids = trackIdList.join(',');
    return app.$spotifyApi.$get('/me/tracks/contains', {
      params: {
        ids,
      },
    })
      .catch((err: Error) => {
        console.error({ err });
        return new Array(length).fill(false);
      });
  };
};
