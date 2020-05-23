import { Context } from '@nuxt/types';

export const checkUserFollowedPlaylist = (context: Context) => {
  const { app } = context;

  return ({
    playlistId,
    idList,
  }: {
    playlistId: string
    idList: string[]
  }): Promise<boolean[]> => {
    const { length } = idList;
    const maxLength = 5;
    if (length > maxLength) {
      throw new Error(`idList は最大${maxLength}個までしか指定できませんが、${length}個指定されました。`);
    }

    const ids = idList.join(',');
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
