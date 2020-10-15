import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const reorderPlaylistItems = (context: Context) => {
  const { app } = context;

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
