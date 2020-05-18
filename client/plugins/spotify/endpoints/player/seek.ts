import { Context } from '@nuxt/types';

export const play = (context: Context) => {
  const { app } = context;

  return ({
    deviceId,
    positionMs,
  }: {
    deviceId?: string
    positionMs: number
  }): Promise<void> => {
    const device_id = deviceId ?? app.$state().player.deviceId;

    return app.$spotifyApi.$put('/me/player/seek', null, {
      params: {
        position_ms: positionMs,
        device_id,
      },
    }).catch((err: Error) => {
      console.error({ err });
    });
  };
};
