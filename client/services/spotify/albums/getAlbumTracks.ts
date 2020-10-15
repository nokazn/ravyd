import { Context } from '@nuxt/types';
import { SpotifyAPI, OneToFifty } from '~~/types';

export const getAlbumTracks = (context: Context) => {
  const { app } = context;

  return ({
    albumId,
    limit = 20,
    offset = 0,
    market,
  }: {
    albumId: string;
    limit?: OneToFifty;
    offset?: number;
    market?: SpotifyAPI.Country;
  }): Promise<SpotifyAPI.Paging<SpotifyAPI.SimpleTrack> | undefined> => {
    return app.$spotifyApi.$get(`/albums/${albumId}/tracks`, {
      params: {
        limit,
        offset,
        market,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });
  };
};
