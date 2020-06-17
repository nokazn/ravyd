import { convertUriToId } from '~/scripts/converter/convertUriToId';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { elapsedTime } from '~~/utils/elapsedTime';
import { TRACK_QUEUE_ARTWORK_SIZE } from '~/variables';
import { App, SpotifyAPI } from '~~/types';

export const convertTrackForQueue = (
  isPlaying: boolean,
  artworkSize: number = TRACK_QUEUE_ARTWORK_SIZE,
) => (track: Spotify.Track | SpotifyAPI.Track): App.TrackQueueInfo => {
  // Array#map 関数が呼べるように型を定義する
  const { artists }: { artists: (Spotify.Artist | SpotifyAPI.SimpleArtist)[]} = track;

  const info = {
    isPlaying,
    id: track.id ?? undefined,
    name: track.name,
    uri: track.uri,
    artistList: artists.map((artist) => ({
      id: convertUriToId(artist.uri),
      name: artist.name,
    })),
    releaseName: track.album.name,
    releaseId: convertUriToId(track.album.uri),
    artworkSrc: getImageSrc(track.album.images, artworkSize),
    // @ts-ignore @todo
    duration: elapsedTime(track.duration_ms as number),
  };

  return info;
};
