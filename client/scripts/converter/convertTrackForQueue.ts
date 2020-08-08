import { convertUriToId } from '~/scripts/converter/convertUriToId';
import { App, SpotifyAPI } from '~~/types';

// @todo
type ExtendedTrack = Spotify.Track & {
  duration_ms?: number
}

export const convertTrackForQueue = ({ isSet, isPlaying, offset = 0 }: {
  isSet: boolean
  isPlaying: boolean
  offset?: number
}) => (track: ExtendedTrack | SpotifyAPI.Track, i: number): App.TrackQueueInfo => {
  // Array#map 関数が呼べるように型を定義する
  const { artists }: { artists: (Spotify.Artist | SpotifyAPI.SimpleArtist)[]} = track;

  const info = {
    isSet,
    isPlaying,
    index: i + offset,
    id: track.id ?? undefined,
    name: track.name,
    uri: track.uri,
    releaseName: track.album.name,
    releaseId: convertUriToId(track.album.uri),
    artists: artists.map((artist) => ({
      ...artist,
      id: convertUriToId(artist.uri),
    })),
    images: track.album.images,
    durationMs: track.duration_ms,
  };

  return info;
};
