import type { Context } from '@nuxt/types';

import { getCategory } from './getCategory';
import { getCategoryPlaylists } from './getCategoryPlaylists';
import { getCategories } from './getCategories';
import { getFeaturedPlaylists } from './getFeaturedPlaylists';
import { getNewReleases } from './getNewReleases';
import { getRecommendations } from './getRecommendations';

export const browse = (context: Context) => ({
  getCategory: getCategory(context),
  getCategoryPlaylists: getCategoryPlaylists(context),
  getCategories: getCategories(context),
  getFeaturedPlaylists: getFeaturedPlaylists(context),
  getNewReleases: getNewReleases(context),
  getRecommendations: getRecommendations(context),
});
