import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getEpisode = (context: Context) => {
  const { app } = context;

  return ({ episodeId, market }: {
    episodeId: string
    market?: SpotifyAPI.Country
  }): Promise<SpotifyAPI.Episode | undefined> => {
    const request = app.$spotifyApi.$get(`/episodes/${episodeId}`, {
      params: {
        market,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });

    return request;
  };
};
