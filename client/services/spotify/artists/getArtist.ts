import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getArtist = (context: Context) => {
  const { app } = context;

  return ({ artistId }: {
    artistId: string
  }): Promise<SpotifyAPI.Artist | undefined> => {
    const request = app.$spotifyApi.$get(`/artists/${artistId}`)
      .catch((err: Error) => {
        console.error({ err });
        return undefined;
      });

    return request;
  };
};