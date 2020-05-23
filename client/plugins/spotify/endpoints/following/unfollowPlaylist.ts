import { Context } from '@nuxt/types';

export const unfollowPlaylist = (context: Context) => {
  const { app } = context;

  return ({
    playlistId,
    isPublic = true,
  }: {
    playlistId: string
    isPublic?: boolean
  }): Promise<void> => app.$spotifyApi.$delete(`/playlist/${playlistId}/followers`, {
    params: {
      isPublic,
    },
  }).catch((err: Error) => {
    console.error({ err });
  });
};
