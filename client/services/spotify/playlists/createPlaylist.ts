import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const createPlaylist = (context: Context) => {
  const { app } = context;

  return ({
    userId,
    name,
    isPublic = true,
    isCollaborative = false,
    description,
  }: {
    userId: string;
    name: string;
    isPublic?: boolean;
    isCollaborative?: boolean;
    description?: string;
  }): Promise<SpotifyAPI.Playlist | undefined> => {
    return app.$spotifyApi.$post(`/users/${userId}/playlists`, {
      name,
      public: isPublic,
      collaborative: isCollaborative,
      description,
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });
  };
};
