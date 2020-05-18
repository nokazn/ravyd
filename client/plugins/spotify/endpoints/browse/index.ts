import { Context } from '@nuxt/types';

import { getNewReleases } from './getNewReleases';

export const browse = (context: Context) => ({
  getNewReleases: getNewReleases(context),
});
