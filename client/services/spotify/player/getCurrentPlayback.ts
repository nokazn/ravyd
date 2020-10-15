import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getCurrentPlayback = (context: Context) => {
  const { app } = context;

  return ({ market, additionalTypeList }: {
    market?: SpotifyAPI.Country;
    additionalTypeList?: Array<'track' | 'episode'>;
  }): Promise<SpotifyAPI.Player.CurrentPlayback | undefined> => {
    return app.$spotifyApi.$get('/me/player', {
      params: {
        market,
        additional_types: additionalTypeList?.join(','),
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });
  };
};
