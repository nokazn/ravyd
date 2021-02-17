import type { Context } from '@nuxt/types';
import type { SpotifyAPI, OneToFifty } from 'shared/types';

type Playlists = { playlists: SpotifyAPI.Paging<SpotifyAPI.SimplePlaylist> };

export const getCategoryPlaylists = (context: Context) => {
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
  }): Promise<Partial<Playlists>> => {
    return app.$spotifyApi.$get<Playlists>(`/browse/categories/${categoryId}/playlists`, {
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
