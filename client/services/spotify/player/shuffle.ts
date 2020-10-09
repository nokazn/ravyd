import { Context } from '@nuxt/types';

export const shuffle = (context: Context) => {
  const { app } = context;

  return ({
    deviceId,
    state,
  }: {
    deviceId?: string | undefined
    state: boolean
  }): Promise<void> => {
    const request = app.$spotifyApi.$put('/me/player/shuffle', undefined, {
      params: {
        device_id: deviceId,
        state,
      },
    }).catch((err: Error) => {
      console.error({ err });
      throw new Error(err.message);
    });

    return request;
  };
};