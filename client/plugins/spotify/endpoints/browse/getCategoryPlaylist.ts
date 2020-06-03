import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getCategoryPlaylist = (context: Context) => {
  const { app } = context;

  return ({
    categoryId,
    country,
    limit = 20,
    offset = 0,
  }: {
    categoryId: string
    country?: SpotifyAPI.Country
    limit?: number // 1 ~ 50 まで指定できる
    offset?: number
  }): Promise<{ playlists: SpotifyAPI.Paging<SpotifyAPI.SimplePlaylist> | undefined }> => {
    if (limit < 1 || limit > 50) {
      throw new Error(`limit は1 ~ 50までしか指定できませんが、${limit}と指定されました。`);
    }

    return app.$spotifyApi.$get(`/browse/categories/${categoryId}/playlists`, {
      params: {
        country,
        limit,
        offset,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return {};
    });
  };
};
