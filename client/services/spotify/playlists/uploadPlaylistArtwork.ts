import { Context } from '@nuxt/types';

/**
 * @todo 400 Bad request になる
 */
export const uploadPlaylistArtwork = (context: Context) => {
  const { app } = context;

  return ({
    playlistId,
    artwork,
  }: {
    playlistId: string,
    artwork: string
  }): Promise<void> => {
    const request = app.$spotifyApi.$put(`playlists/${playlistId}/images`, artwork, {
      headers: {
        'Content-Type': 'image/jpeg',
      },
    }).catch((err: Error) => {
      console.error({ err });
      throw new Error(err.message);
    });

    return request;
  };
};
