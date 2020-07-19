import { Context } from '@nuxt/types';

import { convertReleaseForCard } from '~/scripts/converter/convertReleaseForCard';
import {
  TITLE_MAP,
  ReleaseType,
  ReleaseTitle,
  ReleaseInfo,
} from './index';
import { OneToFifty } from '~~/types';

export type ArtistReleaseInfo<T extends ReleaseType = ReleaseType> = Map<T, ReleaseInfo<T>>

export const initalReleaseListMap: ArtistReleaseInfo = new Map([
  [
    'album',
    {
      title: 'アルバム',
      items: [],
      total: 0,
      isFull: false,
      isAbbreviated: undefined,
      isAppended: false,
    },
  ],
  [
    'single',
    {
      title: 'シングル・EP',
      items: [],
      total: 0,
      isFull: false,
      isAbbreviated: undefined,
      isAppended: false,
    },
  ],
  [
    'compilation',
    {
      title: 'コンピレーション',
      items: [],
      total: 0,
      isFull: false,
      isAbbreviated: undefined,
      isAppended: false,
    },
  ],
  [
    'appears_on',
    {
      title: '参加作品',
      items: [],
      total: 0,
      isFull: false,
      isAbbreviated: undefined,
      isAppended: false,
    },
  ],
]);

const getReleaseListHandler = ({ app, params }: Context) => async <T extends ReleaseType>({
  releaseType,
  limit,
  offset,
}: {
  releaseType: T
  limit: OneToFifty
  offset?: number
}): Promise<[T, ReleaseInfo<T>]> => {
  const title: ReleaseTitle<T> = TITLE_MAP[releaseType];

  const country = app.$getters()['auth/userCountryCode'];
  const releases = await app.$spotify.artists.getArtistAlbums({
    artistId: params.artistId,
    country,
    includeGroupList: [releaseType],
    limit,
    offset,
  });
  const items = releases?.items.map(convertReleaseForCard) ?? [];

  const total = releases?.total ?? 0;
  const isFull = releases?.next == null;
  // 未取得のアイテムがある場合に「すべて表示」ボタンを表示するためのフラグ
  const isAbbreviated = total > limit
    ? true
    : undefined;

  return [
    releaseType,
    {
      title,
      items,
      total,
      isFull,
      isAbbreviated,
      isAppended: false,
    },
  ];
};

export const getReleaseListMap = async (
  context: Context,
  limit: OneToFifty,
): Promise<ArtistReleaseInfo<ReleaseType>> => {
  const getReleaseList = getReleaseListHandler(context);

  const [album, single, compilation, appears_on] = await Promise.all([
    getReleaseList({
      releaseType: 'album',
      limit,
    }),
    getReleaseList({
      releaseType: 'single',
      limit,
    }),
    getReleaseList({
      releaseType: 'compilation',
      limit,
    }),
    getReleaseList({
      releaseType: 'appears_on',
      limit,
    }),
  ] as const);

  return new Map<ReleaseType, ReleaseInfo<ReleaseType>>([
    album,
    single,
    compilation,
    appears_on,
  ]);
};
