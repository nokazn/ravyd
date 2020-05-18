import { Context } from '@nuxt/types';

export const pause = (context: Context) => {
  const { app } = context;

  return ({
    deviceId,
    isInitializing = false,
  }: {
    deviceId: string | null
    isInitializing?: false
  } | {
    deviceId?: undefined
    isInitializing: true
  }): Promise<void> => app.$spotifyApi.$put('/me/player/pause', null, {
    params: {
      device_id: deviceId,
    },
  }).catch((err: Error) => {
    if (isInitializing) {
      console.log('Not found another active device.');
    } else {
      console.error({ err });
    }
  });
};
