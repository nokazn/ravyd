import { Context } from '@nuxt/types';

export const shuffle = (context: Context) => {
  const { app } = context;

  return ({
    deviceId,
    state,
  }: {
    deviceId: string | null
    state: boolean
  }): Promise<void> => app.$spotifyApi.$put('/me/player/shuffle', null, {
    params: {
      device_id: deviceId,
      state,
    },
  }).catch((err: Error) => {
    console.error({ err });
  });
};
