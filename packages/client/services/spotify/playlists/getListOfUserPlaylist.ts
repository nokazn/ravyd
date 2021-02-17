import type { Context } from '@nuxt/types';
import type { SpotifyAPI, OneToFifty } from 'shared/types';

export const getListOfUserPlaylist = (context: Context) => {
  const { app } = context;

  /**
   * offset は 0 ~ 10000
   */
  return ({
    userId,
    limit = 20,
    offset = 0,
  }: {
    userId: string;
    limit?: OneToFifty;
    offset?: number;
  }): Promise<SpotifyAPI.Paging<SpotifyAPI.SimplePlaylist> | undefined> => {
    return app.$spotifyApi.$get<SpotifyAPI.Paging<SpotifyAPI.SimplePlaylist>>(`/users/${userId}/playlists`, {
      params: {
        limit,
        offset,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });
  };
};
