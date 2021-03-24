import dayjs from 'dayjs';

import type { SpotifyAPI } from 'shared/types';
import type { App } from '~/entities';

export const convertReleaseDate = ({ releaseDate, releaseDatePrecision, format }: {
  releaseDate: string
  releaseDatePrecision: 'year' | 'month' | 'day'
  format?: string
}) => {
  // releaseDate のフォーマットと date のフォーマットの配列
  const releaseDateFormat = {
    year: ['YYYY', 'YYYY年'] as const,
    month: ['YYYY-MM', 'YYYY年M月'] as const,
    day: ['YYYY-MM-DD', 'YYYY年M月D日'] as const,
  }[releaseDatePrecision];
  const date = dayjs(releaseDate, releaseDateFormat[0]).format(format ?? releaseDateFormat[1]);

  return date;
};

export const convertReleaseType = (
  releaseType: SpotifyAPI.Album['album_type'],
  totalTracks: number,
): App.ReleasePage['releaseType'] => {
  return ({
    album: 'アルバム',
    // 4曲以上収録の場合は EP と表記
    single: totalTracks > 3
      ? 'EP'
      : 'シングル',
    compilation: 'コンピレーション',
  } as const)[releaseType];
};

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
