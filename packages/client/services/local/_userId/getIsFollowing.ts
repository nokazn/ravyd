import type { Context } from '@nuxt/types';

export const getIsFollowing = async ({ app, params }: Context): Promise<boolean | undefined> => {
  const { userId } = params;
  if (userId === app.$getters()['auth/userId']) return undefined;

  const [isFollowing] = await app.$spotify.following.checkUserFollowed({
    type: 'user',
    idList: [params.userId],
  });

  return isFollowing;
};
