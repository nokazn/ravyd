import { Context } from '@nuxt/types';

import { convertPlaylistTrackDetail } from '~/scripts/converter/convertPlaylistTrackDetail';
import { App } from '~~/types';

/**
 * limit は 0 ~ 50
 */
export const getTrackList = async (
  { app, params }: Context,
  limit: number,
): Promise<App.PlaylistTrackDetail[] | null> => {
  const { playlistId } = params;
  const market = app.$getters()['auth/userCountryCode'];
  const tracks = await app.$spotify.playlists.getPlaylistItems({
    playlistId,
    limit,
    offset: 0,
    market,
  });
  if (tracks == null) return null;

  const trackIdList = tracks.items.map(({ track }) => track.id);
  const isTrackSavedList = await app.$spotify.library.checkUserSavedTracks({
    trackIdList,
  });

  return tracks.items.map(convertPlaylistTrackDetail({ isTrackSavedList }));
};
