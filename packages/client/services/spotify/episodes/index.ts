import type { Context } from '@nuxt/types';

import { getEpisode } from './getEpisode';
import { getEpisodes } from './getEpisodes';

export const episodes = (context: Context) => ({
  getEpisode: getEpisode(context),
  getEpisodes: getEpisodes(context),
});
