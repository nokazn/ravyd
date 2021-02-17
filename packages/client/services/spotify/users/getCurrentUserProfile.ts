import type { Context } from '@nuxt/types';
import type { SpotifyAPI } from 'shared/types';

export const getCurrentUserProfile = (context: Context) => {
  const { app } = context;

  return (): Promise<SpotifyAPI.UserData | undefined> => {
    return app.$spotifyApi.$get<SpotifyAPI.UserData>('/me')
      .catch((err: Error) => {
        console.error({ err });
        return undefined;
      });
  };
};
