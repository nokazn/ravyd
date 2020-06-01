import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getAlbum = (context: Context) => {
  const { app } = context;

  return ({ albumId, market }: {
    albumId: string
    market?: SpotifyAPI.Country
  }): Promise<SpotifyAPI.Album | null> => app.$spotifyApi.$get(`/albums/${albumId}`, {
    params: { market },
  })
    .catch((err: Error) => {
      console.error({ err });
      return null;
    });
};
