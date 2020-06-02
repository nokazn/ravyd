import { Context } from '@nuxt/types';

export const checkUserFollowedPlaylist = (context: Context) => {
  const { app } = context;

  return ({
    playlistId,
    playlistIdList,
  }: {
    playlistId: string
    playlistIdList: string[]
  }): Promise<boolean[]> => {
    const { length } = playlistIdList;
    const maxLength = 5;
    if (length > maxLength) {
      throw new Error(`playlistIdList は最大${maxLength}個までしか指定できませんが、${length}個指定されました。`);
    }

    const ids = playlistIdList.join(',');
    return app.$spotifyApi.$get(`/playlists/${playlistId}/followers/contains`, {
      params: {
        ids,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return new Array(length).fill(false);
    });
  };
};
