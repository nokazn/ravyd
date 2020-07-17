import { convertUriToId } from '~/scripts/converter/convertUriToId';
import { App, SpotifyAPI } from '~~/types';

// @todo
type ExtendedTrack = Spotify.Track & {
  duration_ms?: number
}

export const convertTrackForQueue = (
  isSet: boolean,
  isPlaying: boolean,
) => (track: ExtendedTrack | SpotifyAPI.Track): App.TrackQueueInfo => {
  // Array#map 関数が呼べるように型を定義する
  const { artists }: { artists: (Spotify.Artist | SpotifyAPI.SimpleArtist)[]} = track;

  const info = {
    isSet,
    isPlaying,
    id: track.id ?? undefined,
    name: track.name,
    uri: track.uri,
    releaseName: track.album.name,
    releaseId: convertUriToId(track.album.uri),
    artistList: artists.map((artist) => ({
      id: convertUriToId(artist.uri),
      name: artist.name,
    })),
    artworkList: track.album.images,
    durationMs: track.duration_ms,
  };

  return info;
};
