import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getAlbumTracks = (context: Context) => {
  const { app } = context;

  return ({
    albumId,
    limit = 20,
    offset = 0,
    market,
  }: {
    albumId: string
    limit?: number // 1 ~ 50 まで指定できる
    offset?: number
    market?: SpotifyAPI.Market
  }): Promise<SpotifyAPI.Paging<SpotifyAPI.SimpleTrack> | null> => {
    if (limit < 1 || limit > 50) {
      throw new Error(`limit は1 ~ 50までしか指定できませんが、${limit}と指定されました。`);
    }

    return app.$spotifyApi.$get(`/albums/${albumId}`, {
      params: {
        limit,
        offset,
        market,
      },
    })
      .catch((err: Error) => {
        console.error({ err });
        return null;
      });
  };
};
