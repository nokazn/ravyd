import { Context } from '@nuxt/types';

export const previous = (context: Context) => {
  const { app } = context;

  return (params?: { deviceId?: string | undefined }): Promise<void> => {
    const request = app.$spotifyApi.$post('/me/player/previous', undefined, {
      params,
    }).catch((err: Error) => {
      console.error({ err });
      throw new Error(err.message);
    });

    return request;
  };
};
