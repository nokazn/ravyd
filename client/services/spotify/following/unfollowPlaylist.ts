import { Context } from '@nuxt/types';

export const unfollowPlaylist = (context: Context) => {
  const { app } = context;

  return ({ playlistId }: { playlistId: string }): Promise<void> => {
    const request = app.$spotifyApi.$delete(`/playlists/${playlistId}/followers`)
      .catch((err: Error) => {
        console.error({ err });
        throw new Error(err.message);
      });

    return request;
  };
};
