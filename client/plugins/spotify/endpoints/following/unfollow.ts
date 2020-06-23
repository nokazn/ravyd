import { Context } from '@nuxt/types';

export const unfollow = (context: Context) => {
  const { app } = context;

  return ({ type, artistIdList }: {
    type: 'artist' | 'user'
    artistIdList: string[]
  }): Promise<void> => {
    const { length } = artistIdList;
    const maxLength = 50;
    if (length > maxLength) {
      throw new Error(`artistIdList は最大${maxLength}個までしか指定できませんが、${length}個指定されました。`);
    }

    const ids = artistIdList.join(',');
    return app.$spotifyApi.$delete('/me/following', {
      params: {
        type,
        ids,
      },
    }).catch((err: Error) => {
      console.error({ err });
      throw new Error(err.message);
    });
  };
};
