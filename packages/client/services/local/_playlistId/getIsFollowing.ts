import type { Context } from '@nuxt/types';

export const getIsFollowing = async ({ app, params }: Context): Promise<boolean> => {
  const userId = app.$getters()['auth/userId'];
  if (userId == null) return false;

  const { playlistId } = params;
  const [isFollowing] = await app.$spotify.following.checkUserFollowedPlaylist({
    playlistId,
    userIdList: [userId],
  });

  return isFollowing;
};
