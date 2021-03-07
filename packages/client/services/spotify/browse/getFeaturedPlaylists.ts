import type { Context } from '@nuxt/types';
import type { SpotifyAPI, OneToFifty } from 'shared/types';

export const getFeaturedPlaylists = (context: Context) => {
  const { app } = context;

  /**
   * locale: a lowercase ISO 639-1 language code & an uppercase ISO 3166-1 alpha-2 country code
   * timestamp: ISO 8601 format
   */
  return ({
    timestamp,
    limit = 20,
    offset = 0,
    country = 'from_token',
    locale,
  }: {
    timestamp?: string;
    limit?: OneToFifty;
    offset?: number;
    locale?: string;
    country?: SpotifyAPI.Country;
  }): Promise<Partial<SpotifyAPI.Browse.Featured>> => {
    return app.$spotifyApi.$get<SpotifyAPI.Browse.Featured>('/browse/featured-playlists', {
      params: {
        locale,
        country,
        timestamp,
        limit,
        offset,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return {};
    });
  };
};
