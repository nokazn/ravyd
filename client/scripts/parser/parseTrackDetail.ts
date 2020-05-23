import { elapsedTime } from '~~/utils/elapsedTime';
import { SpotifyAPI } from '~~/types';

export type TrackDetail = {
  index: number
  name: SpotifyAPI.SimpleTrack['name']
  id: SpotifyAPI.SimpleTrack['id']
  uri: SpotifyAPI.SimpleTrack['uri']
  trackNumber: SpotifyAPI.SimpleTrack['track_number']
  discNumber: SpotifyAPI.SimpleTrack['disc_number']
  artists: {
    name: SpotifyAPI.Artist['name'],
    id: SpotifyAPI.Artist['id'],
  }[]
  isPlayable: boolean
  isSaved: boolean
  duration: string
}

export const parseTrackDetail = (isTrackSavedList: boolean[]) => (
  track: SpotifyAPI.SimpleTrack,
  index: number,
): TrackDetail => ({
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
