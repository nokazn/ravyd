import type { Context } from '@nuxt/types';
import type { SpotifyAPI, OneToFifty } from 'shared/types';

type Artists = { artists: SpotifyAPI.Paging<SpotifyAPI.Artist> };

export const getUserFollowed = (context: Context) => {
  const { app } = context;

  return ({
    type = 'artist',
    limit,
    after,
  }: {
    type: 'artist';
    limit?: OneToFifty;
    after?: string;
  }): Promise<Partial<Artists>> => {
    return app.$spotifyApi.$get<Artists>('/me/following', {
      params: {
        type,
        limit,
        after,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return {};
    });
  };
};
