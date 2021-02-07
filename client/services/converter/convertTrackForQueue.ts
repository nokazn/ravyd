import type { SpotifyAPI } from 'shared/types';
import { convertUriToId } from '~/services/converter';
import type { App } from '~/entities';

// TODO
type ExtendedTrack = Spotify.Track & {
  duration_ms?: number
  linked_from?: SpotifyAPI.LinkedTrack
}

export const convertTrackForQueue = ({ isSet, isPlaying, offset = 0 }: {
  isSet: boolean
  isPlaying: boolean
  offset?: number
}) => (track: ExtendedTrack | SpotifyAPI.Track, i: number): App.TrackQueue => {
  // Array#map 関数が呼べるように型を定義する
  const { artists }: { artists: (Spotify.Artist | SpotifyAPI.SimpleArtist)[]} = track;

  const info = {
    isSet,
    isPlaying,
    index: i + offset,
    type: track.type,
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
    linkedFrom: track.linked_from,
  };

  return info;
};
