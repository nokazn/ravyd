import type { Context } from '@nuxt/types';
import type { SpotifyAPI } from 'shared/types';

type Tracks = { tracks: SpotifyAPI.Track[] };

export const getArtistTopTracks = (context: Context) => {
  const { app } = context;

  return ({ artistId, country = 'from_token' }: {
    artistId: string;
    country?: SpotifyAPI.Country;
  }): Promise<Partial<Tracks>> => {
    return app.$spotifyApi.$get<Tracks>(`/artists/${artistId}/top-tracks`, {
      params: {
        country,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return {};
    });
  };
};
