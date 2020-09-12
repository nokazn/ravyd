import { Context } from '@nuxt/types';
import { convertTrackDetail } from '~/utils/converter';
import { App, SpotifyAPI } from '~~/types';

/**
 * deprecated
 */
export const getTrackListHandler = ({ app, params }: Context) => async (
  {
    offset,
    releaseId,
    releaseName,
    artistIdList,
    images,
  } : {
    offset: number
    releaseId: string
    releaseName: string
    artistIdList: string[]
    images: SpotifyAPI.Image[]
  },
): Promise<{
  trackList: App.TrackDetail[]
  durationMs: number
  isFullTrackList: boolean
}> => {
  const market = app.$getters()['auth/userCountryCode'];
  const limit = 50;

  const tracks = await app.$spotify.albums.getAlbumTracks({
    albumId: params.releaseId,
    market,
    limit,
    offset,
  });
  if (tracks == null) {
    app.$toast.push({
      color: 'error',
      message: 'トラックが取得できませんでした。',
    });

    return {
      trackList: [],
      durationMs: 0,
      isFullTrackList: true,
    };
  }

  const trackIdList = tracks.items.map((track) => track.id);
  const isTrackSavedList = await app.$spotify.library.checkUserSavedTracks({ trackIdList });
  const trackList = tracks.items.map((track, i) => {
    const detail = convertTrackDetail<SpotifyAPI.SimpleTrack>({
      isTrackSavedList,
      offset,
      releaseId,
      releaseName,
      images,
      artistIdList,
    })(track, i);

    return detail;
  });

  const durationMs = trackList.reduce((prev, curr) => prev + curr.durationMs, 0);

  const isFullTrackList = tracks.next == null;

  return {
    trackList,
    durationMs,
    isFullTrackList,
  };
};
