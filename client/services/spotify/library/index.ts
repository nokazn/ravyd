import { Context } from '@nuxt/types';

import { checkUserSavedAlbums } from './checkUserSavedAlbums';
import { checkUserSavedShows } from './checkUserSavedShows';
import { checkUserSavedTracks } from './checkUserSavedTracks';
import { getUserSavedAlbums } from './getUserSavedAlbums';
import { getUserSavedShows } from './getUserSavedShows';
import { getUserSavedTracks } from './getUserSavedTracks';
import { removeUserSavedAlbums } from './removeUserSavedAlbums';
import { removeUserSavedShows } from './removeUserSavedShows';
import { removeUserSavedTracks } from './removeUserSavedTracks';
import { saveAlbums } from './saveAlbums';
import { saveShows } from './saveShows';
import { saveTracks } from './saveTracks';

export const library = (context: Context) => ({
  checkUserSavedAlbums: checkUserSavedAlbums(context),
  checkUserSavedShows: checkUserSavedShows(context),
  checkUserSavedTracks: checkUserSavedTracks(context),
  getUserSavedAlbums: getUserSavedAlbums(context),
  getUserSavedShows: getUserSavedShows(context),
  getUserSavedTracks: getUserSavedTracks(context),
  removeUserSavedAlbums: removeUserSavedAlbums(context),
  removeUserSavedShows: removeUserSavedShows(context),
  removeUserSavedTracks: removeUserSavedTracks(context),
  saveAlbums: saveAlbums(context),
  saveShows: saveShows(context),
  saveTracks: saveTracks(context),
});
