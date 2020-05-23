import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getArtistRelatedArtists = (context: Context) => {
  const { app } = context;

  return ({ artistId }: {
    artistId: string
  }): Promise<{ artists: SpotifyAPI.Artist | undefined }> => app.$spotifyApi.$get(`/artists/${artistId}/related-artists`)
    .catch((err: Error) => {
      console.error({ err });
      return {};
    });
};
