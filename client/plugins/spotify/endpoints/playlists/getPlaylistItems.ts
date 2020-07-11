import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getPlaylistItems = (context: Context) => {
  const { app } = context;

  /**
   * fields 必要な情報をカンマ区切りで指定する
   * limit は 0 ~ 50
   * offset は 0 ~ 10000
   */
  return ({
    playlistId,
    fields,
    limit = 20,
    offset = 0,
    market,
    additionalTypeList,
  }: {
    playlistId: string
    fields?: string
    limit?: number
    offset?: number
    market?: string
    additionalTypeList?: Array<'track' | 'episode'>
  }): Promise<SpotifyAPI.Paging<SpotifyAPI.PlaylistTrack> | undefined> => {
    const request = app.$spotifyApi.$get(`/playlists/${playlistId}/tracks`, {
      params: {
        fields,
        limit,
        offset,
        market,
        additional_types: additionalTypeList?.join(','),
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });

    return request;
  };
};
