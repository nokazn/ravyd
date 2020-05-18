import { Context } from '@nuxt/types';

export const saveShows = (context: Context) => {
  const { app } = context;

  return ({ showIdList }: { showIdList: string[] }): Promise<void> => {
    const { length } = showIdList;
    const maxLength = 20;
    if (length > maxLength) {
      throw new Error(`showIdList は最大${maxLength}個までしか指定できませんが、${length}個指定されました。`);
    }

    const ids = showIdList.join(',');
    return app.$spotifyApi.$put('/me/shows', null, {
      params: {
        ids,
      },
    })
      .catch((err: Error) => {
        console.error({ err });
      });
  };
};
