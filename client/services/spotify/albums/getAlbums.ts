import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getAlbums = (context: Context) => {
  const { app } = context;

  /**
   * albumIdList はの長さは最大 20
   */
  return ({ albumIdList, market }: {
    albumIdList: string[]
    market?: SpotifyAPI.Country
  }): Promise<{ albums: (SpotifyAPI.Album | null)[] }> => {
    const limit = 20;
    const handler = async (index: number) => {
      // limit ごとに分割
      const ids = albumIdList.slice(limit * index, limit).join(',');
      const { albums }: { albums: (SpotifyAPI.Album | null)[]} = await app.$spotifyApi.$get('/albums', {
        params: {
          ids,
          market,
        },
      }).catch((err: Error) => {
        console.error({ err });
        return { albums: new Array(ids.length).fill(null) };
      });

      return albums;
    };
    const handlerCounts = Math.ceil(albumIdList.length / limit);

    const albums = Promise.all(new Array(handlerCounts)
      .fill(undefined)
      .map((_, i) => handler(i)))
      .then((albumLists) => ({ albums: albumLists.flat() }));

    return albums;
  };
};
