import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getPlaylistArtwork = (context: Context) => {
  const { app } = context;

  return ({
    playlistId,
  }: {
    playlistId: string
    limit: number
    offset: number
  }): Promise<SpotifyAPI.Image[] | null> => {
    const request = app.$spotifyApi.$get(`/playlists/${playlistId}/images`, {
    }).catch((err: Error) => {
      console.error({ err });
      return null;
    });

    return request;
  };
};
