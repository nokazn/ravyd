import { Context } from '@nuxt/types';
import { ZeroToHundred } from '~~/types';

export const volume = (context: Context) => {
  const { app } = context;

  return ({
    deviceId,
    volumePercent,
  }: {
    deviceId?: string | undefined;
    volumePercent: ZeroToHundred;
  }): Promise<void> => {
    return app.$spotifyApi.$put<void>('/me/player/volume', undefined, {
      params: {
        device_id: deviceId,
        volume_percent: volumePercent,
      },
    }).catch((err: Error) => {
      console.error({ err });
      throw err;
    });
  };
};
