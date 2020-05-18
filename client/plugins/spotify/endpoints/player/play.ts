import { Context } from '@nuxt/types';

export const play = (context: Context) => {
  const { app } = context;

  return ({
    deviceId,
    contextUri,
    trackUriList,
    offset,
  }: {
    deviceId?: string
    contextUri?: string
    trackUriList?: string[]
    offset?: {
      uri: string // position ではなく uri で指定する
    }
    positionMs?: number
  }): Promise<void> => {
    const device_id = deviceId ?? app.$state().player.deviceId;
    const uris = trackUriList?.join(',');
    // uri が指定されなかったか、指定した uri がせっとされているトラックと同じ場合は一時停止中のトラックを再生
    const isRestartingPlayer = (contextUri == null && trackUriList == null)
      || app.$state().player.trackUri === offset?.uri;
    const bodyParams = isRestartingPlayer
      ? {
        position_ms: app.$state().player.position,
        offset,
      }
      : {
        context_uri: contextUri,
        uris,
        offset,
      };

    return app.$spotifyApi.$put('/me/player/play', bodyParams, {
      params: {
        device_id,
      },
    }).catch((err: Error) => {
      console.error({ err });
    });
  };
};
