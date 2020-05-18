import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getAlbum = (context: Context) => {
  const { app } = context;

  return ({ albumId }: {
    albumId: string
  }): Promise<SpotifyAPI.Album | null> => app.$spotifyApi.$get(`/albums/${albumId}`)
    .catch((err: Error) => {
      console.error({ err });
      return null;
    });
};
