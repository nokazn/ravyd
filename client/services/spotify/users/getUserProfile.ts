import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getUserProfile = (context: Context) => {
  const { app } = context;

  return ({ userId }: {
    userId: string;
  }): Promise<SpotifyAPI.UserData | undefined> => {
    return app.$spotifyApi.$get<SpotifyAPI.UserData>(`/users/${userId}`)
      .catch((err: Error) => {
        console.error({ err });
        return undefined;
      });
  };
};
