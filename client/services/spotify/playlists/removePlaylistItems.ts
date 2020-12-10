import type { Context } from '@nuxt/types';

import { multipleRequests } from '~/utils/request/multipleRequests';
import type { SpotifyAPI } from '~~/types';

export const removePlaylistItems = (context: Context) => {
  const { app } = context;

  return ({
    playlistId,
    tracks,
    snapshotId,
  }: {
    playlistId: string;
    tracks: {
      uri: string;
      positions?: number[];
    }[]
    snapshotId?: string;
  }): Promise<Partial<SpotifyAPI.PlaylistSnapshot>['snapshot_id'][]> => {
    const { length } = tracks;
    if (length === 0) {
      return Promise.resolve([]);
    }

    const limit = 100;
    const handler = (index: number): Promise<Partial<SpotifyAPI.PlaylistSnapshot>['snapshot_id']> => {
      const partialTracks = tracks.slice(limit * index, limit * (index + 1));
      // TODO: https://github.com/axios/axios/issues/3220#issuecomment-688566578
      return app.$spotifyApi.$request<SpotifyAPI.PlaylistSnapshot>({
        method: 'DELETE',
        url: `/playlists/${playlistId}/tracks`,
        data: {
          tracks: partialTracks,
          snapshot_id: snapshotId,
        },
      })
        .then(({ snapshot_id }) => snapshot_id)
        .catch((err: Error) => {
          console.error({ err });
          return undefined;
        });
    };

    return multipleRequests(handler, length, limit);
  };
};
