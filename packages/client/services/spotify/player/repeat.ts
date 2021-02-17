import type { Context } from '@nuxt/types';
import type { SpotifyAPI } from 'shared/types';

export const repeat = (context: Context) => {
  const { app } = context;

  return ({
    deviceId,
    state,
  }: {
    deviceId: string | undefined;
    state: SpotifyAPI.RepeatState;
  }): Promise<void> => {
    return app.$spotifyApi.$put<void>('/me/player/repeat', undefined, {
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
