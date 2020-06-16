import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { convertReleaseDate } from '~/scripts/converter/convertReleaseDate';
import { SpotifyAPI, App } from '~~/types';

export const convertReleaseForCard = (artworkSize?: number) => (
  release: SpotifyAPI.Album | SpotifyAPI.SimpleAlbum,
): App.ReleaseCardInfo => ({
  type: release.type,
  releaseType: release.album_type,
  releaseId: release.id,
  id: release.id,
  name: release.name,
  uri: release.uri,
  artists: release.artists.map((artist) => ({
    name: artist.name,
    id: artist.id,
  })),
  releaseYear: convertReleaseDate({
    releaseDate: release.release_date,
    releaseDatePrecision: release.release_date_precision,
    format: 'YYYY年',
  }),
  artworkSrc: getImageSrc(release.images, artworkSize),
});
