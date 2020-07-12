import { Context } from '@nuxt/types';

export const previous = (context: Context) => {
  const { app } = context;

  return ({ deviceId }: { deviceId?: string | undefined }): Promise<void> => {
    const request = app.$spotifyApi.$post('/me/player/previous', undefined, {
      params: {
        device_id: deviceId,
      },
    }).catch((err: Error) => {
      console.error({ err });
    });

    return request;
  };
};
