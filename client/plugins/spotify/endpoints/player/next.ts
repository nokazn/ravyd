import { Context } from '@nuxt/types';

export const next = (context: Context) => {
  const { app } = context;

  return ({ deviceId }: { deviceId: string | null }): Promise<void> => app.$spotifyApi.$post('/me/player/next', null, {
    params: {
      device_id: deviceId,
    },
  }).catch((err: Error) => {
    console.error({ err });
  });
};
