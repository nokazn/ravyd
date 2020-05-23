import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getArtists = (context: Context) => {
  const { app } = context;

  return ({ artistIdList }: {
    artistIdList: string[] // 最大 50
  }): Promise<{ artists: SpotifyAPI.Artist[] | undefined }> => {
    const { length } = artistIdList;
    const maxLength = 50;
    if (length > maxLength) {
      throw new Error(`artistIdList は最大${maxLength}個までしか指定できませんが、${length}個指定されました。`);
    }

    const ids = artistIdList.join(',');
    return app.$spotifyApi.$get('/artists', {
      params: {
        ids,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return {};
    });
  };
};
