import { Context } from '@nuxt/types';

import { convertTrackDetail } from '~/scripts/converter/convertTrackDetail';
import { App } from '~~/types';

export const getTopTrackList = async (
  { app, params }: Context,
  artworkSize: number,
): Promise<App.TrackDetail[] | undefined> => {
  const country = app.$getters()['auth/userCountryCode'];
  if (country == null) return undefined;

  const { tracks } = await app.$spotify.artists.getArtistTopTracks({
    artistId: params.artistId,
    country,
  });
  if (tracks == null) return undefined;

  const trackIdList = tracks.map((track) => track.id);
  const isTrackSavedList = await app.$spotify.library.checkUserSavedTracks({ trackIdList });
  const trackList = tracks.map(convertTrackDetail({
    isTrackSavedList,
    artworkSize,
  }));

  return trackList;
};
