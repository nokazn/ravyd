import { Context } from '@nuxt/types';

import { convertTrackDetail } from '~/scripts/converter/convertTrackDetail';
import { App } from '~~/types';

export const getTopTrackList = async (
  { app, params }: Context,
  artworkSize: number,
): Promise<App.TrackDetail[] | undefined> => {
  const country = app.$getters()['auth/userCountryCode'];
  if (country == null) return undefined;

  const { artistId } = params;
  const { tracks } = await app.$spotify.artists.getArtistTopTracks({
    artistId,
    country,
  });
  if (tracks == null) return undefined;
  if (tracks.length === 0) return [];

  const trackIdList = tracks.map((track) => track.id);
  const isTrackSavedList = await app.$spotify.library.checkUserSavedTracks({ trackIdList });
  const trackList = tracks.map(convertTrackDetail({
    artistIdList: [artistId],
    isTrackSavedList,
    artworkSize,
  }));

  return trackList;
};
