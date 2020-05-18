import { Context } from '@nuxt/types';

export const volume = (context: Context) => {
  const { app } = context;

  return ({
    deviceId,
    volumePercent,
  }: {
    deviceId: string | null
    volumePercent: number
  }): Promise<void> => {
    if (volumePercent < 0 || volumePercent > 100) {
      throw new Error(`volumePercent は0 ~ 100までしか指定できませんが、${volumePercent}と指定されました。`);
    }

    return app.$spotifyApi.$put('/me/player/volume', null, {
      params: {
        device_id: deviceId,
        volume_percent: volumePercent,
      },
    }).catch((err: Error) => {
      console.error({ err });
    });
  };
};
