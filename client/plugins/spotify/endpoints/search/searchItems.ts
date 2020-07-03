import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const searchItems = (context: Context) => {
  const { app } = context;

  return <T extends SpotifyAPI.SearchType[]>({
    query,
    typeList,
    market,
    limit = 20,
    offset = 0,
    includeExternal,
  }: {
    query: string
    typeList: T
    market?: SpotifyAPI.Country
    limit?: number
    offset?: number
    includeExternal?: 'audio'
  }): Promise<
    SpotifyAPI.SearchResult<T extends [SpotifyAPI.SearchType] ? T[0] : T[number]>
  > => {
    if (query === '') return Promise.resolve({});

    // スペースをエンコード
    const q = query.replace(/\s/g, '%20');
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
      return {};
    });

    return request;
  };
};