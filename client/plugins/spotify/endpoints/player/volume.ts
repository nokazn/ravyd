import { Context } from '@nuxt/types';

export const volume = (context: Context) => {
  const { app } = context;

  return ({
    deviceId,
    volumePercent,
  }: {
    deviceId?: string
    volumePercent: number
  }): Promise<void> => {
    if (volumePercent < 0 || volumePercent > 100) {
      throw new Error(`volumePercent は0 ~ 100までしか指定できませんが、${volumePercent}と指定されました。`);
    }

    const device_id = deviceId ?? app.$state().player.deviceId;

    return app.$spotifyApi.$put('/me/player/volume', null, {
      params: {
        device_id,
        volume_percent: volumePercent,
      },
    }).catch((err: Error) => {
      console.error({ err });
    });
  };
};
