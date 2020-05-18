import { Context } from '@nuxt/types';

export const shuffle = (context: Context) => {
  const { app } = context;

  return ({ deviceId }: { deviceId?: string }): Promise<void> => {
    const device_id = deviceId ?? app.$state().player.deviceId;
    const state = !app.$state().player.isShuffled;

    return app.$spotifyApi.$put('/me/player/shuffle', null, {
      params: {
        device_id,
        state,
      },
    }).catch((err: Error) => {
      console.error({ err });
    });
  };
};
