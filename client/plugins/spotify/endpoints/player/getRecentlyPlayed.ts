import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

type Payload = {
  limit?: number // 1 ~ 50 まで指定できる
  after?: undefined
  before: undefined
} | {
  limit?: number // 1 ~ 50 まで指定できる
  after: number
  before?: undefined
} | {
  limit?: number // 1 ~ 50 まで指定できる
  after?: undefined
  before: number
}

export const getNewReleases = (context: Context) => {
  const { app } = context;

  /**
   * after と before はどちらか一方をミリ秒で指定する
   */
  return ({
    limit = 20,
    after,
    before,
  }: Payload): Promise<SpotifyAPI.Player.RecentlyPlayed | null> => {
    if (limit < 1 || limit > 50) {
      throw new Error(`limit は1 ~ 50までしか指定できませんが、${limit}と指定されました。`);
    }

    return app.$spotifyApi.$get('/me/player/recently-played', {
      params: {
        limit,
        after,
        before,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return null;
    });
  };
};
