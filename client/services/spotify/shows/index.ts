import { Context } from '@nuxt/types';
import { getShow } from './getShow';
import { getShowEpisodes } from './getShowEpisodes';
import { getShows } from './getShows';

export const shows = (context: Context) => ({
  getShow: getShow(context),
  getShowEpisodes: getShowEpisodes(context),
  getShows: getShows(context),
});
