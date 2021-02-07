import type { Context } from '@nuxt/types';
import { convertTrackDetail } from '~/services/converter';
import type { App } from '~/entities';

export const getTopTrackList = async (
  { app, params }: Context,
): Promise<App.TrackDetail[]> => {
  const country = app.$getters()['auth/userCountryCode'];
  if (country == null) return [];

  const { artistId } = params;
  const { tracks } = await app.$spotify.artists.getArtistTopTracks({
    artistId,
    country,
  });
  if (tracks == null || tracks.length === 0) return [];

  const trackIdList = tracks.map((track) => track.id);
  const isTrackSavedList = await app.$spotify.library.checkUserSavedTracks({ trackIdList });
  const trackList = tracks.map(convertTrackDetail({
    artistIdList: [artistId],
    isTrackSavedList,
  }));

  return trackList;
};
