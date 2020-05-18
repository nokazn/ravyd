import { Context } from '@nuxt/types';

import { getAlbum } from './getAlbum';
import { getAlbums } from './getAlbums';
import { getAlbumTracks } from './getAlbumTracks';

export const albums = (context: Context) => ({
  getAlbum: getAlbum(context),
  getAlbums: getAlbums(context),
  getAlbumTracks: getAlbumTracks(context),
});
