import { Context } from '@nuxt/types';
import { SpotifyAPI, OneToFifty } from '~~/types';

export const getRecentlyPlayed = (context: Context) => {
  const { app } = context;

  /**
   * after と before はどちらか一方をミリ秒で指定する
   */
  return (params?: {
    limit?: OneToFifty;
    after?: number;
    before?: number;
  }): Promise<SpotifyAPI.Player.RecentlyPlayed | undefined> => {
    const limit = params?.limit;
    if (limit != null && (limit < 1 || limit > 50)) {
      throw new Error(`limit は1 ~ 50までしか指定できませんが、${limit}と指定されました。`);
    }

    return app.$spotifyApi.$get<SpotifyAPI.Player.RecentlyPlayed>('/me/player/recently-played', {
      params: {
        limit: 20,
        ...params,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });
  };
};
