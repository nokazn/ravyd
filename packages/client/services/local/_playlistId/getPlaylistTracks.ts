import type { Context } from '@nuxt/types';

import type { OneToFifty } from 'shared/types';
import { convertPlaylistTrackDetail } from '~/services/converter';
import type { App } from '~/entities';

export interface PlaylistTracks {
  items: App.PlaylistTrackDetail[];
  hasNext: boolean;
  hasPrevious: boolean;
}

export const getPlaylistTracks = async (
  { app, params }: Context,
  { limit, offset = 0 }: {
    limit: OneToFifty;
    offset?: number;
  },
): Promise<PlaylistTracks | undefined> => {
  const { playlistId } = params;
  const tracks = await app.$spotify.playlists.getPlaylistItems({
    playlistId,
    limit,
    offset,
  });
  if (tracks == null) return undefined;

  const filteredTrackList = tracks.items.filter((item): item is App.FilteredPlaylistTrack => item.track != null);
  if (filteredTrackList.length === 0) {
    return {
      items: [],
      hasNext: false,
      hasPrevious: false,
    };
  }
  const trackIdList = filteredTrackList.map(({ track }) => track.id);
  const isTrackSavedList = await app.$spotify.library.checkUserSavedTracks({ trackIdList });
  const items = filteredTrackList.map(convertPlaylistTrackDetail({
    isTrackSavedList,
    offset,
  }));
  return {
    items,
    hasNext: tracks.next != null,
    hasPrevious: tracks.previous != null,
  };
};
