import type { Context } from '@nuxt/types';
import type { SpotifyAPI, OneToFifty } from 'shared/types';
import { convertTrackDetail } from '~/services/converter';
import type { App } from '~/entities';

/**
 * @deprecated
 */
export const getAllTrackListHandler = ({ app, params }: Context) => async (
  {
    offset,
    counts,
    releaseId,
    releaseName,
    artistIdList,
    images,
  } : {
    offset: number
    counts: number
    releaseId: string
    releaseName: string
    artistIdList: string[]
    images: SpotifyAPI.Image[]
  },
): Promise<App.TrackDetail[]> => {
  const market = app.$getters()['auth/userCountryCode'];
  const maxLimit = 50;
  const handler = async (index: number, limit?: OneToFifty): Promise<App.TrackDetail[]> => {
    const tracks = await app.$spotify.albums.getAlbumTracks({
      albumId: params.releaseId,
      market,
      limit: limit ?? maxLimit,
      offset: limit != null
        ? offset + limit * index
        : offset,
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
        images,
      })(track, i);

      return detail;
    });

    return partialTrackList;
  };

  const handlerCounts = Math.ceil(counts / maxLimit);
  const trackList = await Promise.all(new Array(handlerCounts)
    .fill(undefined)
    .map((_, i) => handler(i)))
    .then((trackLists) => trackLists.flat());

  return trackList;
};
