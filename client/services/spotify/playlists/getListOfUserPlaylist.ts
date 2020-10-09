import { Context } from '@nuxt/types';
import { SpotifyAPI, OneToFifty } from '~~/types';

export const getListOfUserPlaylist = (context: Context) => {
  const { app } = context;

  /**
   * limit は 1 ~ 50
   * offset は 0 ~ 10000
   */
  return ({
    userId,
    limit = 20,
    offset = 0,
  }: {
    userId: string
    limit?: OneToFifty
    offset?: number
  }): Promise<SpotifyAPI.Paging<SpotifyAPI.SimplePlaylist> | undefined> => {
    const request = app.$spotifyApi.$get(`/users/${userId}/playlists`, {
      params: {
        limit,
        offset,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });

    return request;
  };
};
