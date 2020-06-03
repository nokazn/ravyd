import { Context } from '@nuxt/types';

import { getCategory } from './getCategory';
import { getCategoryPlaylist } from './getCategoryPlaylist';
import { getCategoryList } from './getCategoryList';
import { getNewReleases } from './getNewReleases';

export const browse = (context: Context) => ({
  getCategory: getCategory(context),
  getCategoryPlaylist: getCategoryPlaylist(context),
  getCategoryList: getCategoryList(context),
  getNewReleases: getNewReleases(context),
});
