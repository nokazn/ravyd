import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const createPlaylist = (context: Context) => {
  const { app } = context;

  return ({
    userId,
    name,
    isPublic = true,
    collaborative = false,
    description,
  }: {
    userId: string
    name: string
    isPublic?: boolean
    collaborative?: boolean
    description?: string
  }): Promise<SpotifyAPI.Playlist | undefined> => {
    const request = app.$spotifyApi.$post(`/users/${userId}/playlists`, {
      name,
      public: isPublic,
      collaborative,
      description,
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });

    return request;
  };
};
