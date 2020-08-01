import { Context } from '@nuxt/types';

export const getIsFollowing = async ({ app, params }: Context): Promise<boolean> => {
  const [isFollowing] = await app.$spotify.following.checkUserFollowed({
    type: 'user',
    idList: [params.userId],
  });

  return isFollowing;
};
