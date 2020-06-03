import { convertUriToId } from '~/scripts/converter/convertUriToId';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { App } from '~~/types';

export const convertTrackForQueue = (isPlaying: boolean, artworkSize?: number) => (
  track: Spotify.Track,
): App.TrackQueueInfo => ({
  isPlaying,
  id: track.id,
  name: track.name,
  uri: track.uri,
  artistList: track.artists.map((artist) => ({
    id: convertUriToId(artist.uri),
    name: artist.name,
  })),
  releaseName: track.album.name,
  releaseId: convertUriToId(track.album.uri),
  artworkSrc: getImageSrc(track.album.images, artworkSize),
});
