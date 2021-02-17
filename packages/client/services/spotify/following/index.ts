import type { Context } from '@nuxt/types';

import { checkUserFollowed } from './checkUserFollowed';
import { checkUserFollowedPlaylist } from './checkUserFollowedPlaylist';
import { follow } from './follow';
import { followPlaylist } from './followPlaylist';
import { getUserFollowed } from './getUserFollowed';
import { unfollow } from './unfollow';
import { unfollowPlaylist } from './unfollowPlaylist';

export const following = (context: Context) => ({
  checkUserFollowed: checkUserFollowed(context),
  checkUserFollowedPlaylist: checkUserFollowedPlaylist(context),
  follow: follow(context),
  followPlaylist: followPlaylist(context),
  getUserFollowed: getUserFollowed(context),
  unfollow: unfollow(context),
  unfollowPlaylist: unfollowPlaylist(context),
});
