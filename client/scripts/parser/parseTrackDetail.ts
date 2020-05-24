import { elapsedTime } from '~~/utils/elapsedTime';
import { App, SpotifyAPI } from '~~/types';
import { getImageSrc } from './getImageSrc';
import { hasProp } from '~~/utils/hasProp';

/**
 * アルバム情報が取得できない (SpotifyAPI.SimpleTrack) 場合は artworkSrc は省略して返す
 */
export const parseTrackDetail = ({
  isTrackSavedList,
  artworkSize,
}: {
  isTrackSavedList: boolean[]
  artworkSize?: number
}) => (
  track: SpotifyAPI.Track | SpotifyAPI.SimpleTrack,
  index: number,
): App.TrackDetail => {
  const baseDetail = {
    index,
    name: track.name,
    id: track.id,
    uri: track.uri,
    trackNumber: track.track_number,
    discNumber: track.disc_number,
    hash: `${track.disc_number}-${track.track_number}`,
    artistList: track.artists.map((artist) => ({
      name: artist.name,
      id: artist.id,
    })),
    explicit: track.explicit,
    isSaved: isTrackSavedList[index],
    duration: elapsedTime(track.duration_ms),
  };
  const hasAlbumInfo = hasProp(track, 'album');
  if (!hasAlbumInfo) return baseDetail;

  const { album: { images, id: releaseId } } = track as SpotifyAPI.Track;
  return {
    ...baseDetail,
    artworkSrc: getImageSrc(images, artworkSize),
    releaseId,
  };
};
