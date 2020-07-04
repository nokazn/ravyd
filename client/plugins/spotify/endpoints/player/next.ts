import { Context } from '@nuxt/types';

export const next = (context: Context) => {
  const { app } = context;

  return ({ deviceId }: { deviceId: string | undefined }): Promise<void> => {
    const request = app.$spotifyApi.$post('/me/player/next', undefined, {
      params: { device_id: deviceId },
    }).catch((err: Error) => {
      console.error({ err });
      throw new Error(err.message);
    });

    return request;
  };
};
