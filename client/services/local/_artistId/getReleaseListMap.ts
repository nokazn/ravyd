import type { Context } from '@nuxt/types';
import { convertReleaseForCard } from '~/utils/converter';
import type { App, OneToFifty } from '~~/types';

export const TITLE_MAP = {
  album: 'アルバム',
  single: 'シングル・EP',
  compilation: 'コンピレーション',
  appears_on: '参加作品',
} as const;

export type ReleaseType = keyof typeof TITLE_MAP
export type ReleaseTitle<T extends ReleaseType> = typeof TITLE_MAP[T]
export type Release<T extends ReleaseType> = {
  title: ReleaseTitle<T>;
  items: App.ReleaseCard<'album'>[];
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
  // undefined の時は最初からすべて表示
  isAllShown: boolean | undefined;
  isAppended: boolean;
}
export type ArtistRelease<T extends ReleaseType = ReleaseType> = Map<T, Release<T>>

export const initalReleaseListMap: ArtistRelease = new Map([
  [
    'album',
    {
      title: 'アルバム',
      items: [],
      total: 0,
      hasNext: false,
      hasPrevious: false,
      isAllShown: undefined,
      isAppended: false,
    },
  ],
  [
    'single',
    {
      title: 'シングル・EP',
      items: [],
      total: 0,
      hasNext: false,
      hasPrevious: false,
      isAllShown: undefined,
      isAppended: false,
    },
  ],
  [
    'compilation',
    {
      title: 'コンピレーション',
      items: [],
      total: 0,
      hasNext: false,
      hasPrevious: false,
      isAllShown: undefined,
      isAppended: false,
    },
  ],
  [
    'appears_on',
    {
      title: '参加作品',
      items: [],
      total: 0,
      hasNext: false,
      hasPrevious: false,
      isAllShown: undefined,
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
}): Promise<[T, Release<T>]> => {
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
  const hasNext = releases?.next != null;
  const hasPrevious = releases?.previous != null;
  // 未取得のアイテムがある場合に「すべて表示」ボタンを表示するためのフラグ
  const isAllShown = total > limit
    ? false
    : undefined;

  return [
    releaseType,
    {
      title,
      items,
      total,
      hasNext,
      hasPrevious,
      isAllShown,
      isAppended: false,
    },
  ];
};

export const getReleaseListMap = async (
  context: Context,
  limit: OneToFifty,
): Promise<ArtistRelease<ReleaseType>> => {
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

  return new Map<ReleaseType, Release<ReleaseType>>([
    album,
    single,
    compilation,
    appears_on,
  ]);
};
