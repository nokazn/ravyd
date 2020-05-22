import { Context } from '@nuxt/types';

export const removeUserSavedTracks = (context: Context) => {
  const { app } = context;

  return ({ trackIdList }: { trackIdList: string[] }): Promise<void | null> => {
    const { length } = trackIdList;
    const maxLength = 20;
    if (length > maxLength) {
      throw new Error(`albumIdList は最大${maxLength}個までしか指定できませんが、${length}個指定されました。`);
    }

    const ids = trackIdList.join(',');
    return app.$spotifyApi.$delete('/me/tracks', {
      params: {
        ids,
      },
    }).catch((err: Error) => {
      console.error({ err });
    });
  };
};
