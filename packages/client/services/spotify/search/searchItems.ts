import type { Context } from '@nuxt/types';
import type { SpotifyAPI, OneToFifty } from 'shared/types';

type SearchResults<T extends SpotifyAPI.SearchType[]> = SpotifyAPI.SearchResult<
  T extends [SpotifyAPI.SearchType] ? T[0] : T[number]
>;

export const searchItems = (context: Context) => {
  const { app } = context;

  return <T extends SpotifyAPI.SearchType[]>({
    query,
    typeList,
    limit = 20,
    offset = 0,
    market = 'from_token',
    includeExternal,
  }: {
    query: string;
    typeList: T;
    limit?: OneToFifty;
    offset?: number;
    market?: SpotifyAPI.Country;
    includeExternal?: 'audio';
  }): Promise<SearchResults<T>> => {
    if (query === '') return Promise.resolve({});

    // \s と " はエンコードされる
    return app.$spotifyApi.$get<SearchResults<T>>('/search', {
      params: {
        q: query,
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
  };
};
