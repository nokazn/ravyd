import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getActiveDeviceList = (context: Context) => {
  const { app } = context;

  return (): Promise<{ devices: SpotifyAPI.Device[] | undefined }> => app.$spotifyApi.$get('/me/player/devices')
    .catch((err: Error) => {
      console.error({ err });
      return {};
    });
};
