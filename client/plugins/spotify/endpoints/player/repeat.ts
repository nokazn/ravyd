import { Context } from '@nuxt/types';

import { SpotifyAPI } from '~~/types';

export const repeat = (context: Context) => {
  const { app } = context;

  return ({
    deviceId,
    state,
  }: {
    deviceId?: string
    state: SpotifyAPI.RepeatState
  }): Promise<void> => {
    const device_id = deviceId ?? app.$state().player.deviceId;

    return app.$spotifyApi.$put('/me/player/repeat', null, {
      params: {
        device_id,
        state,
      },
    }).catch((err: Error) => {
      console.error({ err });
    });
  };
};
