import { Context } from '@nuxt/types';

export const transferPlayback = (context: Context) => {
  const { app } = context;

  /**
   * play === false の場合は現在の再生状態を維持
   */
  return ({ deviceId, play }: {
    deviceId: string;
    play: boolean;
  }): Promise<void> => {
    return app.$spotifyApi.$put<void>('/me/player', {
      device_ids: [deviceId],
      play,
    }).catch((err: Error) => {
      console.error({ err });
      throw err;
    });
  };
};
