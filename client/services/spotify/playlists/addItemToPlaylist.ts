import type { Context } from '@nuxt/types';
import type { SpotifyAPI } from 'shared/types';

export const addItemToPlaylist = (context: Context) => {
  const { app } = context;

  /**
   * track または episode の uri を指定する
   */
  return ({
    playlistId,
    uriList,
    position,
  }: {
    playlistId: string;
    uriList?: string[];
    position?: number;
  }): Promise<Partial<SpotifyAPI.PlaylistSnapshot>> => {
    return app.$spotifyApi.$post<SpotifyAPI.PlaylistSnapshot>(`/playlists/${playlistId}/tracks`, {
      uris: uriList,
      position,
    }).catch((err: Error) => {
      console.error({ err });
      return {};
    });
  };
};
