import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getListOfUserPlaylist = (context: Context) => {
  const { app } = context;

  /**
   * limit は 0 ~ 50
   * offset は 0 ~ 10000
   */
  return ({
    limit = 20,
    offset = 0,
  }: {
    limit: number
    offset: number
  }): Promise<SpotifyAPI.SimplePlaylist | null> => {
    const request = app.$spotifyApi.$get('/me/playlists', {
      params: {
        limit,
        offset,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return null;
    });

    return request;
  };
};
