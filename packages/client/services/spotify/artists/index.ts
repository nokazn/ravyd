import type { Context } from '@nuxt/types';

import { getArtist } from './getArtist';
import { getArtistAlbums } from './getArtistAlbums';
import { getRelatedArtists } from './getRelatedArtists';
import { getArtists } from './getArtists';
import { getArtistTopTracks } from './getArtistTopTracks';

export const artists = (context: Context) => ({
  getArtist: getArtist(context),
  getArtistAlbums: getArtistAlbums(context),
  getRelatedArtists: getRelatedArtists(context),
  getArtists: getArtists(context),
  getArtistTopTracks: getArtistTopTracks(context),
});
