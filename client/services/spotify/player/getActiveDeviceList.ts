import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

type Devices = { devices: SpotifyAPI.Device[] };

export const getActiveDeviceList = (context: Context) => {
  const { app } = context;

  return (): Promise<Partial<Devices>> => {
    return app.$spotifyApi.$get<Devices>('/me/player/devices')
      .catch((err: Error) => {
        console.error({ err });
        return {};
      });
  };
};
