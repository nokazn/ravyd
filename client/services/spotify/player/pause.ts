import { Context } from '@nuxt/types';

export const pause = (context: Context) => {
  const { app } = context;

  return (params: { deviceId: string | undefined } | undefined): Promise<void> => {
    const device_id = params?.deviceId;
    return app.$spotifyApi.$put<void>('/me/player/pause', undefined, {
      params: {
        device_id,
      },
    }).catch((err: Error) => {
      console.error({ err });
      throw err;
    });
  };
};
