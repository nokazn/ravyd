import { Context } from '@nuxt/types';
import { convertPlaylistTrackDetail } from '~/scripts/converter/convertPlaylistTrackDetail';
import { App } from '~~/types';

export const getUserSavedTracks = async (
  { app }: Context,
  offset?: number,
): Promise<App.PlaylistTrackDetail[] | null> => {
  // @todo market
  const tracks = await app.$spotify.library.getUserSavedTracks({
    limit: 30,
    offset,
  });
  if (tracks == null) return null;

  const trackIdList = tracks.items.map(({ track }) => track.id);
  const isTrackSavedList = await app.$spotify.library.checkUserSavedTracks({ trackIdList });
  const trackList = tracks.items
    .map(convertPlaylistTrackDetail({ isTrackSavedList }));

  return trackList;
};
