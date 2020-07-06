import { Context } from '@nuxt/types';

export const addItemToQueue = (context: Context) => {
  const { app } = context;

  /**
   * uri は track か episode
   */
  return ({ uri, deviceId }: { uri: string, deviceId?: string }): Promise<void> => {
    const request = app.$spotifyApi.$post('/me/player/queue', undefined, {
      params: {
        uri,
        device_id: deviceId,
      },
    }).catch((err: Error) => {
      console.error({ err });
      throw new Error(err.message);
    });

    return request;
  };
};
