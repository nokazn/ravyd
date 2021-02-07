import type { SpotifyAPI } from 'shared/types';

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
