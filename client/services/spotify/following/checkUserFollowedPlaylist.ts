import { Context } from '@nuxt/types';
import { multipleRequestsWithId } from '~/utils/request';

export const checkUserFollowedPlaylist = (context: Context) => {
  const { app } = context;

  return ({
    playlistId,
    userIdList,
  }: {
    playlistId: string;
    userIdList: string[];
  }): Promise<boolean[]> => {
    const { length } = userIdList;
    if (length === 0) {
      return Promise.resolve([]);
    }

    const request = (ids: string) => {
      // limit ごとに分割
      return app.$spotifyApi.$get<boolean[]>(`/playlists/${playlistId}/followers/contains`, {
        params: { ids },
      }).catch((err: Error) => {
        console.error({ err });
        const isFollowed: boolean[] = new Array(length).fill(false);
        return isFollowed;
      });
    };
    return multipleRequestsWithId(request, userIdList, 5, (lists) => lists.flat());
  };
};
