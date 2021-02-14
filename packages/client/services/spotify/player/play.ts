import type { Context } from '@nuxt/types';

export const play = (context: Context) => {
  const { app } = context;

  /**
   * contextUri が album/playlist の時のみに offset.uri が有効
   * trackUriList が指定された時のみに offset.position が有効
   */
  return ({
    deviceId,
    contextUri,
    trackUriList,
    offset,
    positionMs,
  }: {
    deviceId: string | undefined;
    contextUri?: string;
    trackUriList?: string[];
    offset?: { uri: string } | { position: number };
    positionMs?: number;
  }): Promise<void> => {
    return app.$spotifyApi.$put<void>('/me/player/play', {
      context_uri: contextUri,
      uris: trackUriList,
      offset,
      position_ms: positionMs,
    }, {
      params: {
        device_id: deviceId,
      },
    }).catch((err: Error) => {
      console.error({ err });
      throw err;
    });
  };
};
