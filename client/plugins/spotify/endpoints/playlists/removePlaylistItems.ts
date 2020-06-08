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
  }): Promise<SpotifyAPI.PlaylistSnapshot | null> => {
    const request = app.$spotifyApi.$delete(`/playlists/${playlistId}/tracks`, {
      params: {
        tracks,
        snapshot_id: snapshotId,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return null;
    });

    return request;
  };
};
