import { getImageSrc } from '~/scripts/parser/getImageSrc';
import { SpotifyAPI, App } from '~~/types';

export const parseTrackForCard = (artworkSize?: number) => (
  track: SpotifyAPI.Track,
): App.ReleaseCardInfo => ({
  type: track.type,
  id: track.id,
  name: track.name,
  releaseType: track.album.album_type,
  releaseId: track.album.id,
  uri: track.uri,
  artists: track.artists.map((artist) => ({
    name: artist.name,
    id: artist.id,
  })),
  artworkSrc: getImageSrc(track.album.images, artworkSize),
});
