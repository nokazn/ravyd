import type { Context } from '@nuxt/types';
import type { SpotifyAPI } from 'shared/types';
import { multipleRequests } from '~/utils/request/multipleRequests';
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
  }): Promise<Partial<SpotifyAPI.PlaylistSnapshot>[]> => {
    const length = uriList?.length;
    const limit = 100;
    const handler = (index: number) => {
      const uris = uriList?.slice(limit * index, limit * (index + 1));
      // TODO: 1周目のリクエストでは replace する
      if (index === 0) {
        return app.$spotifyApi.$put<SpotifyAPI.PlaylistSnapshot>(`/playlists/${playlistId}/tracks`, { uris });
      }
      return addItemToPlaylist(context)({
        playlistId,
        uriList: uris,
      });
    };

    return length == null
      ? handler(0).then((snapshotId) => [snapshotId])
      : multipleRequests(handler, length, limit);
  };
};
