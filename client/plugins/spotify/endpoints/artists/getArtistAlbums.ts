import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getArtistAlbums = (context: Context) => {
  const { app } = context;

  /**
   * limit は 1~50 で指定
   * offset は 0 以上で指定
   */
  return ({
    artistId,
    includeGroupList,
    country,
    limit = 20,
    offset = 0,
  }: {
    artistId: string
    includeGroupList?: Array<'album' | 'single' | 'appears_on' | 'compilation'>
    country?: SpotifyAPI.Country
    limit?: number
    offset?: number
  }): Promise<SpotifyAPI.Paging<SpotifyAPI.SimpleAlbum> | null> => {
    if (limit < 1 || limit > 50) {
      throw new Error(`limit は1 ~ 50までしか指定できませんが、${limit}と指定されました。`);
    }

    const include_groups = includeGroupList?.join(',');

    return app.$spotifyApi.$get(`/artists/${artistId}/albums`, {
      params: {
        include_groups,
        country,
        limit,
        offset,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return null;
    });
  };
};
