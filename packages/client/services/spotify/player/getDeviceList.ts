import type { Context } from '@nuxt/types';
import type { SpotifyAPI } from 'shared/types';

type Devices = { devices: SpotifyAPI.Device[] };

export const getDeviceList = (context: Context) => {
  const { app } = context;

  return (): Promise<Partial<Devices>> => {
    return app.$spotifyApi.$get<Devices>('/me/player/devices')
      .catch((err: Error) => {
        console.error({ err });
        return {};
      });
  };
};
