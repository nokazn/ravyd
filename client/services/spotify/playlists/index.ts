import { Context } from '@nuxt/types';

import { addItemToPlaylist } from './addItemToPlaylist';
import { createPlaylist } from './createPlaylist';
import { editPlaylistDetail } from './editPlaylistDetail';
import { getListOfCurrentUserPlaylist } from './getListOfCurrentUserPlaylist';
import { getListOfUserPlaylist } from './getListOfUserPlaylist';
import { getPlaylist } from './getPlaylist';
import { getPlaylistArtwork } from './getPlaylistArtwork';
import { getPlaylistItems } from './getPlaylistItems';
import { removePlaylistItems } from './removePlaylistItems';
import { reorderPlaylistItems } from './reorderPlaylistItems';
import { replacePlaylistItems } from './replacePlaylistItems';
import { uploadPlaylistArtwork } from './uploadPlaylistArtwork';

export const playlists = (context: Context) => ({
  addItemToPlaylist: addItemToPlaylist(context),
  createPlaylist: createPlaylist(context),
  editPlaylistDetail: editPlaylistDetail(context),
  getListOfCurrentUserPlaylist: getListOfCurrentUserPlaylist(context),
  getListOfUserPlaylist: getListOfUserPlaylist(context),
  getPlaylist: getPlaylist(context),
  getPlaylistArtwork: getPlaylistArtwork(context),
  getPlaylistItems: getPlaylistItems(context),
  removePlaylistItems: removePlaylistItems(context),
  reorderPlaylistItems: reorderPlaylistItems(context),
  replacePlaylistItems: replacePlaylistItems(context),
  uploadPlaylistArtwork: uploadPlaylistArtwork(context),
});
