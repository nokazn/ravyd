import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getPlaylistArtwork = (context: Context) => {
  const { app } = context;

  return ({ playlistId }: {
    playlistId: string;
  }): Promise<SpotifyAPI.Image[]> => {
    return app.$spotifyApi.$get<SpotifyAPI.Image[]>(`/playlists/${playlistId}/images`, {
    }).catch((err: Error) => {
      console.error({ err });
      return [];
    });
  };
};
