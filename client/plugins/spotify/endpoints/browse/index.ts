import { Context } from '@nuxt/types';

import { getCategoryList } from './getCategoryList';
import { getNewReleases } from './getNewReleases';

export const browse = (context: Context) => ({
  getCategoryList: getCategoryList(context),
  getNewReleases: getNewReleases(context),
});
