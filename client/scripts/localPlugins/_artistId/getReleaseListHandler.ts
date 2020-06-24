import { Context } from '@nuxt/types';

import { convertReleaseForCard } from '~/scripts/converter/convertReleaseForCard';
import { App } from '~~/types';

const titleMap = {
  album: 'アルバム',
  single: 'シングル・EP',
  compilation: 'コンピレーション',
  appears_on: '参加作品',
} as const;

export type ReleaseType = keyof typeof titleMap
export type ReleaseTitle<T extends ReleaseType> = typeof titleMap[T]
export type ReleaseInfo<T extends ReleaseType> = {
  title: ReleaseTitle<T>
  items: App.ReleaseCardInfo[] | undefined
  isFull: boolean
}

export const getReleaseListHandler = ({ app, params }: Context) => async <T extends ReleaseType>(
  releaseType: T,
  artworkSize: number,
  offset?: number,
): Promise<ReleaseInfo<T>> => {
  const title: ReleaseTitle<T> = titleMap[releaseType];

  const country = app.$getters()['auth/userCountryCode'];
  const releases = await app.$spotify.artists.getArtistAlbums({
    artistId: params.artistId,
    country,
    limit: 20,
    includeGroupList: [releaseType],
    offset,
  });
  const items = releases?.items.map(convertReleaseForCard(artworkSize));

  const isFull = releases?.next == null;

  return {
    title,
    items,
    isFull,
  };
};
