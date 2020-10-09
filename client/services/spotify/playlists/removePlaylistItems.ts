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
  }): Promise<Partial<SpotifyAPI.PlaylistSnapshot>[]> => {
    const { length } = tracks;
    if (length === 0) {
      return Promise.resolve([{}]);
    }

    const limit = 100;
    const handler = (index: number): Promise<Partial<SpotifyAPI.PlaylistSnapshot>> => {
      const partialTracks = tracks.slice(limit * index, limit);
      // @todo https://github.com/axios/axios/issues/3220#issuecomment-688566578
      return app.$spotifyApi.$request({
        method: 'DELETE',
        url: `/playlists/${playlistId}/tracks`,
        data: {
          tracks: partialTracks,
          snapshot_id: snapshotId,
        },
      }).catch((err: Error) => {
        console.error({ err });
        return {};
      });
    };
    const handlerCounts = Math.ceil(length / limit);

    return Promise.all(new Array(handlerCounts)
      .fill(undefined)
      .map((_, i) => handler(i)));
  };
};