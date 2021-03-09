import dayjs from 'dayjs';
import type { RawLocation } from 'vue-router';

import { addComma } from 'shared/utils';
import type { SpotifyAPI } from 'shared/types';
import type { App } from '~/entities';

type CopyrightMap = Record<string, ('C' | 'P')[]>

export const convertAddedAt = (addedAt: string): App.AddedAt => {
  const moment = dayjs(addedAt);
  // 2週間前か否かで表示を分けるため
  const overTwoWeeksAgo = Date.now() - moment.valueOf() > 14 * 24 * 60 * 60 * 1000;
  // 1970-01-01-T00:00:00Z とかを無効にするため、2000年以前のものは無視
  const isTooOld = moment.valueOf() <= new Date(2000, 0, 1).getMilliseconds();
  const text = overTwoWeeksAgo
    ? moment.format('YYYY/M/D')
    : moment.fromNow();

  return {
    origin: addedAt,
    text: isTooOld ? undefined : text,
    title: moment.format('YYYY/M/D H:mm'),
  };
};

export const generateContentPath = (
  type: App.ContentItemType,
  id: string,
  trackId?: string,
): RawLocation => {
  const linkType = {
    album: 'releases',
    artist: 'artists',
    track: 'releases',
    playlist: 'playlists',
    show: 'shows',
    episode: 'episodes',
  }[type];

  return type === 'track'
    ? {
      path: `/${linkType}/${id}`,
      query: { track: trackId },
    }
    : `/${linkType}/${id}`;
};

export const generateUserContextUri = (userId: string | undefined, type: 'collection' | 'history') => {
  return userId != null
    ? `spotify:user:${userId}:${type}`
    : undefined;
};

export const getFollowersText = (followers: number | null): string | undefined => {
  return followers != null
    ? `フォロワー ${addComma(followers)}人`
    : undefined;
};


const computeAbsoluteRatioDiff = (
  num: number | null | undefined,
  base: number,
): number => (num != null
  ? Math.abs((num / base) - 1)
  : Infinity);

/**
 * minSize より大きいギリギリのサイズの画像の URL を返す
 */
export const getImageSrc = (
  imageList: SpotifyAPI.Image[] | undefined,
  minSize?: number,
): string | undefined => {
  if (imageList == null || imageList.length === 0) return undefined;

  if (minSize == null) return imageList[0].url;

  const appropriateImage: SpotifyAPI.Image = imageList.reduce((prev, curr) => {
    if (prev == null) return curr;

    const prevDiff = computeAbsoluteRatioDiff(prev.width, minSize);
    const currDiff = computeAbsoluteRatioDiff(curr.width, minSize);
    return curr.width != null && currDiff < prevDiff && curr.width >= minSize
      ? curr
      : prev;
  });

  return appropriateImage?.url;
};

export const parseCopyrights = (copyrights: SpotifyAPI.Copyright[]): string[] => {
  const textNormalizedCopyrights = copyrights.map((copyright) => {
    // 文頭の C/P マーク
    const typeReg = copyright.type === 'C'
      ? /^(Ⓒ|🄫|©|ⓒ|⒞|\(C\))\s?/
      : /^(Ⓟ|ⓟ|℗|⒫|\(P\))\s?/;
    return {
      type: copyright.type,
      text: copyright.text.replace(typeReg, ''),
    };
  });
  // 同じ Copyright の文面はまとめる
  const parsedCopyrightMap = textNormalizedCopyrights.reduce<CopyrightMap>((prev, copyright) => ({
    ...prev,
    [copyright.text]: prev[copyright.text] != null
      ? [...prev[copyright.text], copyright.type]
      : [copyright.type],
  }), {});
  const copyrightMapKeys = Object.keys(parsedCopyrightMap) as Array<
    keyof CopyrightMap
  >;

  return copyrightMapKeys.map((key) => {
    const types = parsedCopyrightMap[key]
      .map((type) => ({ C: '©', P: '℗' }[type]))
      .join('');
    return `${types} ${key}`;
  });
};
