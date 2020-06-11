import { Context } from '@nuxt/types';

import { convertPlaylistTrackDetail } from '~/scripts/converter/convertPlaylistTrackDetail';
import { App } from '~~/types';

/**
 * limit は 0 ~ 50
 */
export const getPlaylistTrackInfo = async (
  { app, params }: Context,
  limit: number,
): Promise<App.PlaylistTrackInfo | null> => {
  const { playlistId } = params;
  const market = app.$getters()['auth/userCountryCode'];
  const tracks = await app.$spotify.playlists.getPlaylistItems({
    playlistId,
    limit,
    offset: 0,
    market,
  });
  if (tracks == null) return null;

  const filteredTrackList = tracks.items
    .filter(({ track }) => track != null) as App.FilteredPlaylistTrack[];
  const trackIdList = filteredTrackList.map(({ track }) => track.id);
  const isTrackSavedList = await app.$spotify.library.checkUserSavedTracks({
    trackIdList,
  });
  const trackList = filteredTrackList.map(convertPlaylistTrackDetail({ isTrackSavedList }));

  const isFullTrackList = tracks.next == null;

  return {
    trackList,
    isFullTrackList,
  };
};
