import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const searchItems = (context: Context) => {
  const { app } = context;

  return ({
    query,
    typeList,
    market,
    limit,
    offset,
    includeExternal,
  }: {
    query: string
    typeList: Array<'album' | 'artist' | 'playlist' | 'track' | 'show' | 'episode'>
    market?: SpotifyAPI.Country
    limit?: number
    offset?: number
    includeExternal?: 'audio'
  }): Promise<SpotifyAPI.SearchResult | undefined> => {
    if (!query) return Promise.resolve(undefined);

    const q = encodeURIComponent(query);
    const request = app.$spotifyApi.$get('/search', {
      params: {
        q,
        type: typeList.join(','),
        market,
        limit,
        offset,
        includeExternal,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });

    return request;
  };
};
