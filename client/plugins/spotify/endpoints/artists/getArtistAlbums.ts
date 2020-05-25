import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getArtistAlbums = (context: Context) => {
  const { app } = context;

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
