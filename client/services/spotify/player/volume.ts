import { Context } from '@nuxt/types';
import { ZeroToHundred } from '~~/types';

export const volume = (context: Context) => {
  const { app } = context;

  return ({
    deviceId,
    volumePercent,
  }: {
    deviceId?: string | undefined
    volumePercent: ZeroToHundred
  }): Promise<void> => {
    const request = app.$spotifyApi.$put('/me/player/volume', undefined, {
      params: {
        device_id: deviceId,
        volume_percent: volumePercent,
      },
    }).catch((err: Error) => {
      console.error({ err });
      throw new Error(err.message);
    });

    return request;
  };
};