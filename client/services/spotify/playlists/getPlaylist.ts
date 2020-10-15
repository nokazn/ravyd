import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getPlaylist = (context: Context) => {
  const { app } = context;

  /**
   * fields 必要な情報をカンマ区切りで指定する
   */
  return ({
    playlistId,
    fields,
    market,
    additionalTypeList,
  }: {
    playlistId: string;
    fields?: string;
    market?: string;
    additionalTypeList?: Array<'track' | 'episode'>;
  }): Promise<SpotifyAPI.Playlist | undefined> => {
    return app.$spotifyApi.$get<SpotifyAPI.Playlist>(`/playlists/${playlistId}`, {
      params: {
        fields,
        market,
        additional_types: additionalTypeList?.join(','),
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });
  };
};
