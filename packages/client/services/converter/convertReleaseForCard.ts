import type { SpotifyAPI } from 'shared/types';
import { convertReleaseDate } from '~/services/converter';
import type { App } from '~/entities';

export const convertReleaseForCard = (
  release: SpotifyAPI.Album | SpotifyAPI.SimpleAlbum,
): App.ReleaseCard<'album'> => {
  return {
    type: release.type,
    releaseId: release.id,
    id: release.id,
    name: release.name,
    uri: release.uri,
    artists: release.artists,
    releaseYear: convertReleaseDate({
      releaseDate: release.release_date,
      releaseDatePrecision: release.release_date_precision,
      format: 'YYYY年',
    }),
    images: release.images,
    externalUrls: release.external_urls,
  };
};
