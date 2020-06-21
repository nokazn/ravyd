import { Context } from '@nuxt/types';
import { convertTrackDetail } from '~/scripts/converter/convertTrackDetail';
import { App, SpotifyAPI } from '~~/types';

export const getReleaseTrackListHandler = ({ app, params }: Context) => async (
  {
    limit,
    offset,
    totalTracks,
    releaseId,
    releaseName,
    artistIdList,
    artworkSrc,
  } : {
    limit: number
    offset: number
    totalTracks: number
    releaseId: string
    releaseName: string
    artistIdList: string[]
    artworkSrc: string | undefined
  },
): Promise<App.TrackDetail[]> => {
  const market = app.$getters()['auth/userCountryCode'];
  const unacquiredCounts = totalTracks - offset;
  const handlerCounts = Math.ceil(unacquiredCounts / limit);

  const handler = async (index: number): Promise<App.TrackDetail[]> => {
    const tracks = await app.$spotify.albums.getAlbumTracks({
      albumId: params.releaseId,
      offset: offset + limit * index,
      market,
      limit,
    });
    if (tracks == null) return [];

    const trackIdList = tracks.items.map((track) => track.id);
    const isTrackSavedList = await app.$spotify.library.checkUserSavedTracks({ trackIdList });
    const partialTrackList = tracks.items.map((track, i) => {
      const detail = convertTrackDetail<SpotifyAPI.SimpleTrack>({
        isTrackSavedList,
        offset,
        releaseId,
        releaseName,
        artworkSrc,
        artistIdList,
      })(track, i);

      return detail;
    });

    return partialTrackList;
  };

  const trackList = await Promise.all(new Array(handlerCounts)
    .fill(undefined)
    .map((_, index) => handler(index)))
    .then((trackLists) => trackLists.flat());

  return trackList;
};
