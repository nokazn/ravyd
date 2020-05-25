import { getImageSrc } from '~/scripts/parser/getImageSrc';
import { SpotifyAPI, App } from '~~/types';

export const parseReleaseForCard = (artworkSize?: number) => (
  release: SpotifyAPI.Album | SpotifyAPI.SimpleAlbum,
): App.ReleaseCardInfo => ({
  type: release.type,
  id: release.id,
  name: release.name,
  releaseType: release.album_type,
  releaseId: release.id,
  uri: release.uri,
  artists: release.artists.map((artist) => ({
    name: artist.name,
    id: artist.id,
  })),
  artworkSrc: getImageSrc(release.images, artworkSize),
});
