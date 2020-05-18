import { Context } from '@nuxt/types';

export const pause = (context: Context) => {
  const { app } = context;

  return ({
    deviceId,
    isInitializing = false,
  }: {
    deviceId?: string
    isInitializing?: boolean
  }): Promise<void> => {
    const device_id = deviceId ?? app.$state().player.deviceId;

    return app.$spotifyApi.$put('/me/player/pause', null, {
      params: {
        device_id,
      },
    }).catch((err: Error) => {
      if (isInitializing) {
        console.log('Not found another active device.');
      } else {
        console.error({ err });
      }
    });
  };
};
