import { Context } from '@nuxt/types';
import { convertSimpleTrackDetail } from '~/scripts/converter/convertSimpleTrackDetail';
import { App } from '~~/types';

export const getReleaseTrackListHandler = ({ app, params }: Context) => async (
  {
    limit, offset, totalTracks,
  } : {
    limit: number
    offset: number
    totalTracks: number
  },
): Promise<App.SimpleTrackDetail[]> => {
  const market = app.$getters()['auth/userCountryCode'];
  const unacquiredCounts = totalTracks - offset;
  const handlerCounts = Math.ceil(unacquiredCounts / limit);

  const handler = async (index: number) => {
    const tracks = await app.$spotify.albums.getAlbumTracks({
      albumId: params.releaseId,
      offset: offset + index * limit,
      market,
      limit,
    });
    if (tracks == null) return [];

    const trackIdList = tracks.items.map((track) => track.id);
    const isTrackSavedList = await app.$spotify.library.checkUserSavedTracks({ trackIdList });
    const partialTrackList = tracks.items.map((convertSimpleTrackDetail({
      isTrackSavedList,
      offset,
    })));

    return partialTrackList;
  };

  const trackList = await Promise.all(new Array(handlerCounts)
    .fill(undefined)
    .map((_, index) => handler(index)))
    .then((trackLists) => trackLists.flat());

  return trackList;
};
