import { Context } from '@nuxt/types';

export const next = (context: Context) => {
  const { app } = context;

  return ({ deviceId }: { deviceId?: string }): Promise<void> => {
    const device_id = deviceId ?? app.$state().player.deviceId;

    return app.$spotifyApi.$put('/me/player/next', null, {
      params: {
        device_id,
      },
    }).catch((err: Error) => {
      console.error({ err });
    });
  };
};
