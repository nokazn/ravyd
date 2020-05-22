import { Context } from '@nuxt/types';

import { getArtist } from './getArtist';
import { getArtistAlbums } from './getArtistAlbums';
import { getArtistRelatedArtists } from './getArtistRelatedArtists';
import { getArtists } from './getArtists';
import { getArtistTopTracks } from './getArtistTopTracks';

export const artists = (context: Context) => ({
  getArtist: getArtist(context),
  getArtistAlbums: getArtistAlbums(context),
  getArtistRelatedArtists: getArtistRelatedArtists(context),
  getArtists: getArtists(context),
  getArtistTopTracks: getArtistTopTracks(context),
});
