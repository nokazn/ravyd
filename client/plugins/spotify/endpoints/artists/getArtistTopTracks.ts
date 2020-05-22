import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getArtistTopTracks = (context: Context) => {
  const { app } = context;

  return ({ artistId, country }: {
    artistId: string
    country: SpotifyAPI.Country
  }): Promise<{ tracks: SpotifyAPI.Track[] } | null> => app.$spotifyApi.$get(`/artists/${artistId}/top-tracks`, {
    params: {
      country,
    },
  }).catch((err: Error) => {
    console.error({ err });
    return null;
  });
};
