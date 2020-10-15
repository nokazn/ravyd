import { Context } from '@nuxt/types';
import { SpotifyAPI, OneToFifty } from '~~/types';

export const getArtistAlbums = (context: Context) => {
  const { app } = context;

  return ({
    artistId,
    includeGroupList,
    country,
    limit = 20,
    offset = 0,
  }: {
    artistId: string;
    includeGroupList?: Array<'album' | 'single' | 'appears_on' | 'compilation'>;
    country?: SpotifyAPI.Country;
    limit?: OneToFifty;
    offset?: number;
  }): Promise<SpotifyAPI.Paging<SpotifyAPI.SimpleAlbum> | undefined> => {
    const include_groups = includeGroupList?.join(',');

    return app.$spotifyApi.$get<SpotifyAPI.Paging<SpotifyAPI.SimpleAlbum>>(`/artists/${artistId}/albums`, {
      params: {
        include_groups,
        country,
        limit,
        offset,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });
  };
};
