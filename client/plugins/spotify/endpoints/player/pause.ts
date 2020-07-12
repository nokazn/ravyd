import { Context } from '@nuxt/types';

export const pause = (context: Context) => {
  const { app } = context;

  return ({
    deviceId,
    isInitializing = false,
  }: {
    deviceId?: string | undefined
    isInitializing?: false
  } | {
    deviceId?: undefined
    isInitializing: true
  }): Promise<void> => {
    const request = app.$spotifyApi.$put('/me/player/pause', undefined, {
      params: {
        device_id: deviceId,
      },
    }).catch((err: Error) => {
      if (isInitializing) {
        console.log('Not found another active device.');
      } else {
        console.error({ err });
        throw new Error(err.message);
      }
    });

    return request;
  };
};
