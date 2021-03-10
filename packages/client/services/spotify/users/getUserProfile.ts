import type { Context } from '@nuxt/types';
import type { SpotifyAPI } from 'shared/types';

export const getUserProfile = (context: Context) => {
  const { app } = context;

  return ({ userId }: {
    userId: string;
  }): Promise<SpotifyAPI.User | undefined> => {
    return app.$spotifyApi.$get<SpotifyAPI.User>(`/users/${userId}`)
      .catch((err: Error) => {
        console.error({ err });
        return undefined;
      });
  };
};
