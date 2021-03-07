import type { Context } from '@nuxt/types';
import type { SpotifyAPI } from 'shared/types';

export const getEpisode = (context: Context) => {
  const { app } = context;

  return ({ episodeId, market = 'from_token' }: {
    episodeId: string;
    market?: SpotifyAPI.Country;
  }): Promise<SpotifyAPI.Episode | undefined> => {
    return app.$spotifyApi.$get<SpotifyAPI.Episode>(`/episodes/${episodeId}`, {
      params: {
        market,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });
  };
};
