import { Context } from '@nuxt/types';

export const uploadPlaylistArtwork = (context: Context) => {
  const { app } = context;

  /**
   * limit は 0 ~ 50
   * offset は 0 ~ 10000
   */
  return ({
    playlistId,
    artwork,
  }: {
    playlistId: string,
    artwork: any, // @todo
  }): Promise<void> => {
    const request = app.$spotifyApi.$post(`playlists/${playlistId}/images`, artwork)
      .catch((err: Error) => {
        console.error({ err });
      });

    return request;
  };
};
