import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const reorderPlaylistItems = (context: Context) => {
  const { app } = context;

  /**
   * fields 必要な情報をカンマ区切りで指定する
   * limit は 0 ~ 50
   * offset は 0 ~ 10000
   */
  return ({
    playlistId,
    rangeStart,
    rangeLength = 1,
    insertBefore,
    snapshotId,
  }: {
    playlistId: string
    rangeStart: number
    rangeLength?: number
    insertBefore: number
    snapshotId?: string,
  }): Promise<Partial<SpotifyAPI.PlaylistSnapshot>> => {
    const request = app.$spotifyApi.$put(`/playlists/${playlistId}/tracks`, {
      rangeStart,
      rangeLength,
      insertBefore,
      snapshotId,
    }).catch((err: Error) => {
      console.error({ err });
      return {};
    });

    return request;
  };
};
