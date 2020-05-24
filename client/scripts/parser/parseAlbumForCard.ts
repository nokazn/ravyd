import { getImageSrc } from '~/scripts/parser/getImageSrc';
import { SpotifyAPI, App } from '~~/types';

export const parseAlbumForCard = (artworkSize?: number) => (
  release: SpotifyAPI.Album,
): App.ReleaseCardInfo => ({
  type: release.type,
  name: release.name,
  id: release.id,
  releaseId: release.id,
  uri: release.uri,
  artists: release.artists.map((artist) => ({
    name: artist.name,
    id: artist.id,
  })),
  artworkSrc: getImageSrc(release.images, artworkSize),
});
