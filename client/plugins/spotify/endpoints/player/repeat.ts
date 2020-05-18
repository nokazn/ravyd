import { Context } from '@nuxt/types';

import { SpotifyAPI } from '~~/types';

export const repeat = (context: Context) => {
  const { app } = context;

  return ({
    deviceId,
    state,
  }: {
    deviceId: string | null
    state: SpotifyAPI.RepeatState
  }): Promise<void> => app.$spotifyApi.$put('/me/player/repeat', null, {
    params: {
      device_id: deviceId,
      state,
    },
  }).catch((err: Error) => {
    console.error({ err });
  });
};
