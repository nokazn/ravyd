import { getImageSrc } from '~/scripts/parser/getImageSrc';
import { parseReleaseDate } from '~/scripts/parser/parseReleaseDate';
import { SpotifyAPI, App } from '~~/types';

export const parseReleaseForCard = (artworkSize?: number) => (
  release: SpotifyAPI.Album | SpotifyAPI.SimpleAlbum,
): App.ReleaseCardInfo => ({
  type: release.type,
  id: release.id,
  name: release.name,
  releaseType: release.album_type,
  releaseId: release.id,
  releaseYear: parseReleaseDate({
    releaseDate: release.release_date,
    releaseDatePrecision: release.release_date_precision,
    format: 'YYYY年',
  }),
  uri: release.uri,
  artists: release.artists.map((artist) => ({
    name: artist.name,
    id: artist.id,
  })),
  artworkSrc: getImageSrc(release.images, artworkSize),
});
