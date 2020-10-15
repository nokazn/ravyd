import { Context } from '@nuxt/types';

export const next = (context: Context) => {
  const { app } = context;

  return (params?: { deviceId?: string | undefined }): Promise<void> => {
    return app.$spotifyApi.$post<void>('/me/player/next', undefined, {
      params,
    }).catch((err: Error) => {
      console.error({ err });
      throw err;
    });
  };
};
