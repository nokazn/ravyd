import { Context } from '@nuxt/types';

import { convertPlaylistTrackDetail } from '~/scripts/converter/convertPlaylistTrackDetail';
import { App } from '~~/types';

export const getTrackList = async (
  { app, params }: Context,
): Promise<App.PlaylistTrackDetail[] | null> => {
  const { playlistId } = params;
  const tracks = await app.$spotify.playlists.getPlaylistItems({
    playlistId,
    limit: 30,
    offset: 0,
  });
  if (tracks == null) return null;

  const trackIdList = tracks.items.map(({ track }) => track.id);
  const isTrackSavedList = await app.$spotify.library.checkUserSavedTracks({
    trackIdList,
  });

  return tracks.items.map(convertPlaylistTrackDetail({ isTrackSavedList }));
};
