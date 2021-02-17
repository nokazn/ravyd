import type { Context } from '@nuxt/types';
import type { SpotifyAPI } from 'shared/types';

type Artists = { artists: SpotifyAPI.Artist[] };

export const getRelatedArtists = (context: Context) => {
  const { app } = context;

  return ({ artistId }: {
    artistId: string;
  }): Promise<Partial<Artists>> => {
    return app.$spotifyApi.$get<Artists>(`/artists/${artistId}/related-artists`)
      .catch((err: Error) => {
        console.error({ err });
        return {};
      });
  };
};
