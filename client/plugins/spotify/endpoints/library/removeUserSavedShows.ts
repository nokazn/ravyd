import { Context } from '@nuxt/types';

export const removeUserSavedShows = (context: Context) => {
  const { app } = context;

  return ({ showIdList }: { showIdList: string[] }): Promise<void> => {
    const { length } = showIdList;
    const maxLength = 20;
    if (length > maxLength) {
      throw new Error(`albumIdList は最大${maxLength}個までしか指定できませんが、${length}個指定されました。`);
    }

    const ids = showIdList.join(',');
    return app.$spotifyApi.$delete('/me/shows', {
      params: {
        ids,
      },
    })
      .catch((err: Error) => {
        console.error({ err });
      });
  };
};
