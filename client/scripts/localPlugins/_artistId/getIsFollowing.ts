import { Context } from '@nuxt/types';

export const getIsFollowing = async ({ app, params }: Context) => {
  const [isFollowing] = await app.$spotify.following.checkUserFollowed({
    type: 'artist',
    artistIdList: [params.artistId],
  });

  return isFollowing;
};
