import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getTracks = (context: Context) => {
  const { app } = context;

  // trackIdList は50個まで
  return ({
    market,
    trackIdList,
  }: {
    market?: SpotifyAPI.Country;
    trackIdList: string[];
  }): Promise<{ tracks: (SpotifyAPI.Track | null)[]}> => {
    const ids = trackIdList.join(',');
    return app.$spotifyApi.$get('/tracks', {
      params: {
        market,
        ids,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return { tracks: [] };
    });
  };
};
