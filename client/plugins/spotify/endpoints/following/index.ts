import { Context } from '@nuxt/types';

import { checkUserFollowed } from './checkUserFollowed';
import { follow } from './follow';
import { unfollow } from './unfollow';

export const following = (context: Context) => ({
  checkUserFollowed: checkUserFollowed(context),
  follow: follow(context),
  unfollow: unfollow(context),
});
