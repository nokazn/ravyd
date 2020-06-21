import { Context } from '@nuxt/types';

export const editPlaylistDetail = (context: Context) => {
  const { app } = context;

  return ({
    playlistId,
    name,
    isPublic,
    collaborative,
    description,
  }: {
    playlistId: string
    name?: string
    isPublic?: boolean
    collaborative?: boolean
    description?: string
  }): Promise<void> => {
    const request = app.$spotifyApi.$put(`/playlists/${playlistId}`, {
      name,
      public: isPublic,
      collaborative,
      description,
    }).catch((err: Error) => {
      console.error({ err });
      throw new Error(err.message);
    });

    return request;
  };
};
