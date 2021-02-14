import type { Context } from '@nuxt/types';
import type { SpotifyAPI } from 'shared/types';

export const getAlbum = (context: Context) => {
  const { app } = context;

  return ({ albumId, market }: {
    albumId: string;
    market?: SpotifyAPI.Country;
  }): Promise<SpotifyAPI.Album | undefined> => {
    return app.$spotifyApi.$get<SpotifyAPI.Album>(`/albums/${albumId}`, {
      params: { market },
    })
      .catch((err: Error) => {
        console.error({ err });
        return undefined;
      });
  };
};
