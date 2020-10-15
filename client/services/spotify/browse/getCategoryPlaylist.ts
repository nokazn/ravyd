import { Context } from '@nuxt/types';
import { SpotifyAPI, OneToFifty } from '~~/types';

export const getCategoryPlaylist = (context: Context) => {
  const { app } = context;

  return ({
    categoryId,
    country,
    limit = 20,
    offset = 0,
  }: {
    categoryId: string;
    country?: SpotifyAPI.Country;
    limit?: OneToFifty;
    offset?: number;
  }): Promise<{ playlists: SpotifyAPI.Paging<SpotifyAPI.SimplePlaylist> | undefined }> => {
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
