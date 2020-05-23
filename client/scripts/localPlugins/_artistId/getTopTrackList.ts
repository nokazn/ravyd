import { Context } from '@nuxt/types';

import { parseTrackDetail, TrackDetail as _TrackDetail } from '~/scripts/parser/parseTrackDetail';

export type TrackDetail = _TrackDetail;

export const getTopTrackList = async ({ app, params }: Context): Promise<TrackDetail[] | null> => {
  const country = app.$state().auth.userData?.country;
  if (country == null) return null;

  const { tracks } = await app.$spotify.artists.getArtistTopTracks({
    artistId: params.artistId,
    country,
  });
  if (tracks == null) return null;

  const trackIdList = tracks.map((track) => track.id);
  const isTrackSavedList = await app.$spotify.library.checkUserSavedTracks({ trackIdList });

  const trackList = tracks.map(parseTrackDetail(isTrackSavedList));

  return trackList;
};
