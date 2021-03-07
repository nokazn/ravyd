import type { Context } from '@nuxt/types';
import type { SpotifyAPI, OneToFifty } from 'shared/types';

export const getAlbumTracks = (context: Context) => {
  const { app } = context;

  return ({
    albumId,
    limit = 20,
    offset = 0,
    market = 'from_token',
  }: {
    albumId: string;
    limit?: OneToFifty;
    offset?: number;
    market?: SpotifyAPI.Country;
  }): Promise<SpotifyAPI.Paging<SpotifyAPI.SimpleTrack> | undefined> => {
    return app.$spotifyApi.$get<SpotifyAPI.Paging<SpotifyAPI.SimpleTrack>>(`/albums/${albumId}/tracks`, {
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
