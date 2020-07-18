import { Context } from '@nuxt/types';
import { convertTrackDetail } from '~/scripts/converter/convertTrackDetail';
import { App, SpotifyAPI } from '~~/types';

/**
 * deprecated
 */
export const getAllTrackListHandler = ({ app, params }: Context) => async (
  {
    offset,
    counts,
    releaseId,
    releaseName,
    artistIdList,
    artworkList,
  } : {
    offset: number
    counts: number
    releaseId: string
    releaseName: string
    artistIdList: string[]
    artworkList: SpotifyAPI.Image[]
  },
): Promise<App.TrackDetail[]> => {
  const market = app.$getters()['auth/userCountryCode'];
  const limit = 50;
  const handlerCounts = Math.ceil(counts / limit);

  const handler = async (index: number): Promise<App.TrackDetail[]> => {
    const tracks = await app.$spotify.albums.getAlbumTracks({
      albumId: params.releaseId,
      market,
      limit,
      offset: offset + limit * index,
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
        artistIdList,
        artworkList,
      })(track, i);

      return detail;
    });

    return partialTrackList;
  };

  const trackList = await Promise.all(new Array(handlerCounts)
    .fill(undefined)
    .map((_, i) => handler(i)))
    .then((trackLists) => trackLists.flat());

  return trackList;
};
