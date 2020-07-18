import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getArtists = (context: Context) => {
  const { app } = context;

  return ({ artistIdList }: {
    artistIdList: string[]
  }): Promise<{ artists: (SpotifyAPI.Artist | null)[] }> => {
    const limit = 50;
    const handler = async (index: number) => {
      // limit ごとに分割
      const ids = artistIdList.slice(limit * index, limit).join(',');
      const { artists }: { artists: (SpotifyAPI.Artist | null)[] } = await app.$spotifyApi.$get('/artists', {
        params: {
          ids,
        },
      }).catch((err: Error) => {
        console.error({ err });
        return { artists: new Array(ids.length).fill(null) };
      });

      return artists;
    };
    const handlerCounts = Math.ceil(artistIdList.length / limit);

    const artists = Promise.all(new Array(handlerCounts)
      .fill(undefined)
      .map((_, i) => handler(i)))
      .then((artistLists) => ({ artists: artistLists.flat() }));

    return artists;
  };
};
