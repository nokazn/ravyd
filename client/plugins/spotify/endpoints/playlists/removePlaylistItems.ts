import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const removePlaylistItems = (context: Context) => {
  const { app } = context;

  return ({
    playlistId,
    tracks,
    snapshotId,
  }: {
    playlistId: string
    tracks: {
      uri: string
      positions?: number[]
    }[]
    snapshotId?: string,
  }): Promise<Partial<SpotifyAPI.PlaylistSnapshot>> => {
    const request = app.$spotifyApi.$delete(`/playlists/${playlistId}/tracks`, {
      data: {
        tracks,
        snapshot_id: snapshotId,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return {};
    });

    return request;
  };
};
