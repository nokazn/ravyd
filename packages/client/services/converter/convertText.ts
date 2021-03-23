import dayjs from 'dayjs';
import type { RawLocation } from 'vue-router';

import { addComma } from 'shared/utils';
import type { SpotifyAPI } from 'shared/types';
import { REPEAT_STATE_LIST } from '~/constants';
import type { App } from '~/entities';

export const convertAddedAt = (addedAt: string): App.AddedAt => {
  const moment = dayjs(addedAt);
  // 2週間前か否かで表示を分けるため
  const overTwoWeeksAgo = Date.now() - moment.valueOf() > 14 * 24 * 60 * 60 * 1000;
  // 1970-01-01-T00:00:00Z とかを無効にするため、2000年以前のものは無視
  const isTooOld = moment.valueOf() <= Number(new Date(2000, 0, 1));
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

const computeRatioDiff = (num: number | null | undefined, base: number): number => {
  return num != null
    ? num / base
    : Infinity;
};
const getImageLength = (image: SpotifyAPI.Image): number => image.height ?? image.width ?? 0;

/**
 * minSize より大きいギリギリのサイズの画像の URL を返す
 */
export const getImageSrc = (
  imageList: SpotifyAPI.Image[] | undefined,
  minSize?: number,
): string | undefined => {
  if (imageList == null || imageList.length === 0) return undefined;
  if (minSize == null) {
    // 最大のサイズのものを返す
    return imageList.reduce((prev, curr) => (getImageLength(prev) < getImageLength(curr)
      ? curr
      : prev)).url;
  }
  const appropriateImage: SpotifyAPI.Image = imageList.reduce((prev, curr) => {
    const prevDiff = computeRatioDiff(getImageLength(prev), minSize);
    const currDiff = computeRatioDiff(getImageLength(curr), minSize);
    if (prevDiff < 1) {
      // 両方の diff が 1 を超えない場合はより大きい (minSize に近い) 方を選択
      return currDiff > 1 || prevDiff < currDiff
        ? curr
        : prev;
    }
    // diff が 1 を超える中でより小さい (minSize に近い) 方を選択
    return currDiff < 1 || prevDiff < currDiff
      ? prev
      : curr;
  });
  return appropriateImage?.url;
};

type RepeatState = [App.RepeatMode, SpotifyAPI.RepeatState];
const nextRepeatMode = (current: App.RepeatMode) => (current + 1) % REPEAT_STATE_LIST.length as App.RepeatMode;
export const nextRepeatState = (current: RepeatState[number]): RepeatState => {
  const currentIndex = typeof current === 'string'
    ? REPEAT_STATE_LIST.findIndex((r) => r === current) as App.RepeatMode
    : current;
  const index = nextRepeatMode(currentIndex);
  return [index, REPEAT_STATE_LIST[index]];
};

type CopyrightMap = Record<string, ('C' | 'P')[]>
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
  const parsedCopyrightMap = Object.freeze(textNormalizedCopyrights.reduce<CopyrightMap>((prev, copyright) => ({
    ...prev,
    [copyright.text]: prev[copyright.text] != null
      ? [...prev[copyright.text], copyright.type]
      : [copyright.type],
  }), {}));
  const copyrightMapKeys = Object.keys(parsedCopyrightMap) as (keyof CopyrightMap)[];
  return copyrightMapKeys.map((key) => {
    const types = [...new Set(parsedCopyrightMap[key])]
      .map((type) => ({ C: '©', P: '℗' }[type]))
      .join('');
    return `${types} ${key}`;
  });
};
