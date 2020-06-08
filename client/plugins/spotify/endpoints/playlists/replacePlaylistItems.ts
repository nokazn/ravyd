import { Context } from '@nuxt/types';

export const replacePlaylistItems = (context: Context) => {
  const { app } = context;

  /**
   * プレイリスト内の item をすべて上書きする
   * uris: は最大 100 個まで
   */
  return ({
    playlistId,
    uris,
  }: {
    playlistId: string
    uris?: string[]
  }): Promise<void> => {
    const maxUris = 100;
    if (uris != null && uris.length > maxUris) {
      throw new Error(`uris は最大 ${maxUris} 個までですが、${uris.length} 個指定されました。`);
    }

    const request = app.$spotifyApi.$put(`/playlists/${playlistId}/tracks`, {
      uris,
    }).catch((err: Error) => {
      console.error({ err });
    });

    return request;
  };
};
