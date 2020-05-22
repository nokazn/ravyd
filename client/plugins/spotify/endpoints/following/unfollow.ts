import { Context } from '@nuxt/types';

export const unfollow = (context: Context) => {
  const { app } = context;

  return ({
    type,
    idList,
  }: {
    type: 'artist' | 'user'
    idList: string[]
  }): Promise<void> => {
    const { length } = idList;
    const maxLength = 50;
    if (length > maxLength) {
      throw new Error(`idList は最大${maxLength}個までしか指定できませんが、${length}個指定されました。`);
    }

    const ids = idList.join(',');
    return app.$spotifyApi.$delete('/me/following', {
      params: {
        type,
        ids,
      },
    }).catch((err: Error) => {
      console.error({ err });
    });
  };
};
