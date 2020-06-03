import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getCurrentUserProfile = (context: Context) => {
  const { app } = context;

  return (): Promise<SpotifyAPI.UserData | null> => app.$spotifyApi.$get('/me')
    .catch((err: Error) => {
      console.error({ err });
      return null;
    });
};
