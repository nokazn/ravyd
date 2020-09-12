import { Context } from '@nuxt/types';

import { convertPlaylistTrackDetail } from '~/utils/converter';
import { App, OneToFifty } from '~~/types';

/**
 * limit は 0 ~ 50
 */
export const getPlaylistTrackInfo = async (
  { app, params }: Context,
  { limit, offset = 0 }: { limit: OneToFifty, offset?: number },
): Promise<App.PlaylistTrackInfo | undefined> => {
  const { playlistId } = params;
  const market = app.$getters()['auth/userCountryCode'];
  const tracks = await app.$spotify.playlists.getPlaylistItems({
    playlistId,
    limit,
    offset,
    market,
  });
  if (tracks == null) return undefined;

  const filteredTrackList = tracks.items
    .filter(({ track }) => track != null) as App.FilteredPlaylistTrack[];
  if (filteredTrackList.length === 0) {
    return {
      trackList: [],
      isFullTrackList: true,
    };
  }

  const trackIdList = filteredTrackList.map(({ track }) => track.id);
  const isTrackSavedList = await app.$spotify.library.checkUserSavedTracks({
    trackIdList,
  });
  const trackList = filteredTrackList.map(convertPlaylistTrackDetail({
    isTrackSavedList,
    offset,
  }));

  const isFullTrackList = tracks.next == null;

  return {
    trackList,
    isFullTrackList,
  };
};
