import { Context } from '@nuxt/types';

export const play = (context: Context) => {
  const { app } = context;

  return ({
    deviceId,
    contextUri,
    trackUriList,
    offset,
    positionMs,
  }: {
    deviceId: string | null
    contextUri?: string
    trackUriList?: string[]
    offset?: { uri: string } // position ではなく uri で指定する
    positionMs?: number
  }): Promise<void> => app.$spotifyApi.$put('/me/player/play', {
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
  });
};
