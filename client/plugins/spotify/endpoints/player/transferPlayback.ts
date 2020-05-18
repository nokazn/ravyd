import { Context } from '@nuxt/types';

export const transferPlayback = (context: Context) => {
  const { app } = context;

  return ({
    deviceIdList,
    play,
  }: {
    deviceIdList: string[]
    play: boolean
  }): Promise<void> => app.$spotifyApi.$put('/me/player', null, {
    params: {
      device_ids: deviceIdList,
      play,
    },
  }).catch((err: Error) => {
    console.error({ err });
  });
};
