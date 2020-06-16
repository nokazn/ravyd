import { elapsedTime } from '~~/utils/elapsedTime';
import { App, SpotifyAPI } from '~~/types';

export const convertSimpleTrackDetail = ({ isTrackSavedList }: { isTrackSavedList: boolean[] }) => (
  track: SpotifyAPI.SimpleTrack,
  index: number,
): App.SimpleTrackDetail => {
  const detail = {
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
    isPlayable: track.is_playable,
    isSaved: isTrackSavedList[index],
    duration: elapsedTime(track.duration_ms),
  };

  return detail;
};
