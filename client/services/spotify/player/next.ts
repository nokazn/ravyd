import { Context } from '@nuxt/types';

export const next = (context: Context) => {
  const { app } = context;

  return (params?: { deviceId?: string | undefined }): Promise<void> => {
    const request = app.$spotifyApi.$post('/me/player/next', undefined, {
      params,
    }).catch((err: Error) => {
      console.error({ err });
      throw new Error(err.message);
    });

    return request;
  };
};
