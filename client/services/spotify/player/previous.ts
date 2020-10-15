import { Context } from '@nuxt/types';

export const previous = (context: Context) => {
  const { app } = context;

  return (params?: { deviceId?: string | undefined }): Promise<void> => {
    return app.$spotifyApi.$post('/me/player/previous', undefined, {
      params,
    }).catch((err: Error) => {
      console.error({ err });
      throw err;
    });
  };
};
