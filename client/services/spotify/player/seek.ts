import type { Context } from '@nuxt/types';

export const seek = (context: Context) => {
  const { app } = context;

  return ({
    deviceId,
    positionMs,
  }: {
    deviceId: string | undefined;
    positionMs: number;
  }): Promise<void> => {
    return app.$spotifyApi.$put<void>('/me/player/seek', undefined, {
      params: {
        position_ms: positionMs,
        device_id: deviceId,
      },
    }).catch((err: Error) => {
      console.error({ err });
      throw err;
    });
  };
};
