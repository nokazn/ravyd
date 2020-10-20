import { Context } from '@nuxt/types';

export const shuffle = (context: Context) => {
  const { app } = context;

  return ({
    deviceId,
    state,
  }: {
    deviceId: string | undefined;
    state: boolean;
  }): Promise<void> => {
    return app.$spotifyApi.$put<void>('/me/player/shuffle', undefined, {
      params: {
        device_id: deviceId,
        state,
      },
    }).catch((err: Error) => {
      console.error({ err });
      throw err;
    });
  };
};
