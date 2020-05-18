import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getNewReleases = (context: Context) => {
  const { app } = context;

  return (): Promise<SpotifyAPI.Device[] | null> => app.$spotifyApi.$get('/me/player/devices')
    .catch((err: Error) => {
      console.error({ err });
      return null;
    });
};
