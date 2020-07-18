import { Context } from '@nuxt/types';

export const checkUserFollowedPlaylist = (context: Context) => {
  const { app } = context;

  return ({
    playlistId,
    userIdList,
  }: {
    playlistId: string
    userIdList: string[]
  }): Promise<boolean[]> => {
    const { length } = userIdList;
    const limit = 5;
    if (length === 0) {
      return Promise.resolve([]);
    }

    const handler = (index: number): Promise<boolean[]> => {
      // limit ごとに分割
      const ids = userIdList.slice(limit * index, limit).join(',');
      return app.$spotifyApi.$get(`/playlists/${playlistId}/followers/contains`, {
        params: {
          ids,
        },
      }).catch((err: Error) => {
        console.error({ err });
        return new Array(length).fill(false);
      });
    };
    const handlerCounts = Math.ceil(length / limit);

    return Promise.all(new Array(handlerCounts)
      .fill(undefined)
      .map((_, i) => handler(i)))
      .then((isFollowedLists) => isFollowedLists.flat());
  };
};
