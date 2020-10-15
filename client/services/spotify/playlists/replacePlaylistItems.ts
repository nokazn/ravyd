import { Context } from '@nuxt/types';
import { addItemToPlaylist } from './addItemToPlaylist';

export const replacePlaylistItems = (context: Context) => {
  const { app } = context;

  /**
   * プレイリスト内の item をすべて上書きする
   * uris: は最大 100 個まで
   */
  return ({
    playlistId,
    uriList,
  }: {
    playlistId: string
    uriList?: string[]
  }): Promise<void> => {
    const length = uriList?.length;
    const limit = 100;

    const handler = (index?: number) => {
      const uris = uriList?.slice(limit * (index ?? 0), limit);
      // 1周目のリクエストでは replace する
      if (index == null || index === 0) {
        return app.$spotifyApi.$put(`/playlists/${playlistId}/tracks`, {
          uris,
        }).catch((err: Error) => {
          console.error({ err });
          throw new Error(err.message);
        });
      }

      return addItemToPlaylist(context)({
        playlistId,
        uriList: uris,
      });
    };
    if (length == null) return handler();

    const handlerCounts = Math.ceil(length / limit);

    return Promise.all(new Array(handlerCounts)
      .fill(undefined)
      .map((_, i) => handler(i)))
      .then(() => {})
      .catch((err: Error) => {
        console.error({ err });
        throw new Error(err.message);
      });
  };
};
