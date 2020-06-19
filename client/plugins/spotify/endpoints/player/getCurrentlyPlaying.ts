import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getCurrentlyPlaying = (context: Context) => {
  const { app } = context;

  return ({ market, additionalTypeList }: {
    market?: SpotifyAPI.Country
    additionalTypeList?: Array<'track' | 'episode'>
  }): Promise<SpotifyAPI.Player.CurrentlyPlaying | undefined> => {
    const request = app.$spotifyApi.$get('/me/player/currently-playing', {
      params: {
        market,
        additional_types: additionalTypeList?.join(','),
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });

    return request;
  };
};