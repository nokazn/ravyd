import type { Context } from '@nuxt/types';

import { getTopArtists } from './getTopArtists';
import { getTopTracks } from './getTopTracks';

export const top = (context: Context) => ({
  getTopArtists: getTopArtists(context),
  getTopTracks: getTopTracks(context),
});
