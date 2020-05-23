import { elapsedTime } from '~~/utils/elapsedTime';
import { App, SpotifyAPI } from '~~/types';

export const parseTrackDetail = (isTrackSavedList: boolean[]) => (
  track: SpotifyAPI.SimpleTrack,
  index: number,
): App.TrackDetail => ({
  index,
  name: track.name,
  id: track.id,
  uri: track.uri,
  trackNumber: track.track_number,
  discNumber: track.disc_number,
  artists: track.artists.map((artist) => ({
    name: artist.name,
    id: artist.id,
  })),
  isPlayable: track.is_playable,
  isSaved: isTrackSavedList[index],
  duration: elapsedTime(track.duration_ms),
});
