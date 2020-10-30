import { Context } from '@nuxt/types';
import { SpotifyAPI, OneToFifty } from '~~/types';

export const getFeaturedPlaylists = (context: Context) => {
  const { app } = context;

  /**
   * locale: a lowercase ISO 639-1 language code & an uppercase ISO 3166-1 alpha-2 country code
   * timestamp: ISO 8601 format
   */
  return ({
    locale,
    country,
    timestamp,
    limit = 20,
    offset = 0,
  }: {
    locale?: string;
    country?: SpotifyAPI.Country;
    timestamp?: string;
    limit?: OneToFifty;
    offset?: number;
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
