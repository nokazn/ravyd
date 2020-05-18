import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getAlbums = (context: Context) => {
  const { app } = context;

  return ({ albumIdList, market }: {
    albumIdList: string[] // 最大 20
    market?: SpotifyAPI.Market
  }): Promise<SpotifyAPI.Album[] | null> => {
    const { length } = albumIdList;
    const maxLength = 20;
    if (length > maxLength) {
      throw new Error(`albumIdList は最大${maxLength}個までしか指定できませんが、${length}個指定されました。`);
    }

    const ids = albumIdList.join(',');
    return app.$spotifyApi.$get('/me/albums', {
      params: {
        ids,
        market,
      },
    })
      .catch((err: Error) => {
        console.error({ err });
        return null;
      });
  };
};
