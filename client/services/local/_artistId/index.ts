import { App } from '~~/types';

export const TITLE_MAP = {
  album: 'アルバム',
  single: 'シングル・EP',
  compilation: 'コンピレーション',
  appears_on: '参加作品',
} as const;

export type ReleaseType = keyof typeof TITLE_MAP
export type ReleaseTitle<T extends ReleaseType> = typeof TITLE_MAP[T]
export type ReleaseInfo<T extends ReleaseType> = {
  title: ReleaseTitle<T>;
  items: App.ReleaseCard<'album'>[];
  total: number;
  isFull: boolean;
  // undefined の時は最初からすべて表示
  isAllShown: boolean | undefined;
  isAppended: boolean;
}

export * from './getArtistInfo';
export * from './getIsFollowing';
export * from './getRelatedArtistList';
export * from './getReleaseListMap';
export * from './getTopTrackList';
