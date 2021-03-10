import type { Context } from '@nuxt/types';

type Offset = { uri: string; } | { position: number; };

export const play = ({ app }: Context) => {
  /**
   * contextUri が album/playlist の時のみに offset.uri が有効
   * trackUriList が指定された時のみに offset.position が有効
   */
  return ({
    deviceId,
    context,
    offset,
    positionMs,
  }: {
    deviceId: string | undefined;
    context?: string | string[];
    offset?: Offset;
    positionMs?: number;
  }): Promise<void> => {
    const context_uri = typeof context === 'string'
      ? context
      : undefined;
    const uris = Array.isArray(context)
      ? context
      : undefined;
    return app.$spotifyApi.$put<void>('/me/player/play', {
      context_uri,
      uris,
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
