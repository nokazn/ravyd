import { Context } from '@nuxt/types';

import { convertTrackDetail } from '~/scripts/converter/convertTrackDetail';
import { App } from '~~/types';

export const getTopTrackList = async (
  { app, params }: Context,
  artworkSize: number,
): Promise<App.TrackDetail[] | null> => {
  const country = app.$state().auth.userData?.country;
  if (country == null) return null;

  const { tracks } = await app.$spotify.artists.getArtistTopTracks({
    artistId: params.artistId,
    country,
  });
  if (tracks == null) return null;

  const trackIdList = tracks.map((track) => track.id);
  const isTrackSavedList = await app.$spotify.library.checkUserSavedTracks({ trackIdList });
  const trackList = tracks.map(convertTrackDetail({
    isTrackSavedList,
    artworkSize,
  }));

  return trackList;
};
