import { Context } from '@nuxt/types';

export const followPlaylist = (context: Context) => {
  const { app } = context;

  return ({
    playlistId,
    isPublic = true,
  }: {
    playlistId: string;
    isPublic?: boolean;
  }): Promise<void> => {
    return app.$spotifyApi.$put(`/playlists/${playlistId}/followers`, null, {
      params: {
        isPublic,
      },
    }).catch((err: Error) => {
      console.error({ err });
      throw err;
    });
  };
};
