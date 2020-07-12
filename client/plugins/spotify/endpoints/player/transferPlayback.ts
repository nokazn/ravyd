import { Context } from '@nuxt/types';

export const transferPlayback = (context: Context) => {
  const { app } = context;

  return ({ deviceId, play }: {
    deviceId: string
    play: boolean
  }): Promise<void> => {
    const request = app.$spotifyApi.$put('/me/player', {
      device_ids: [deviceId],
      play,
    }).catch((err: Error) => {
      console.error({ err });
      throw new Error(err.message);
    });

    return request;
  };
};
