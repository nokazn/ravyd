import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { SpotifyAPI, App } from '~~/types';

export const convertTrackForCard = (artworkSize?: number) => (
  track: SpotifyAPI.Track,
): App.ReleaseCardInfo => ({
  type: track.type,
  releaseType: track.album.album_type,
  releaseId: track.album.id,
  id: track.id,
  name: track.name,
  uri: track.uri,
  artists: track.artists.map((artist) => ({
    name: artist.name,
    id: artist.id,
  })),
  hash: `${track.disc_number}-${track.track_number}`,
  artworkSrc: getImageSrc(track.album.images, artworkSize),
});
