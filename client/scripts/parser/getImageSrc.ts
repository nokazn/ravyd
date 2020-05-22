import { SpotifyAPI } from '~~/types';

const computeAbsoluteRatioDiff = (
  num: number | null | undefined,
  base: number,
): number => (num != null
  ? Math.abs((num / base) - 1)
  : Infinity);

/**
 * minSize より大きいギリギリのサイズの画像の URL を返す
 */
export const getImageSrc = (imageList: SpotifyAPI.Image[], minSize?: number) => {
  if (minSize == null) return imageList[0].url;

  const appropriateImage = imageList.reduce((prev, curr) => {
    console.log({ curr });
    if (prev == null) return curr;

    const prevDiff = computeAbsoluteRatioDiff(prev.width, minSize);
    const currDiff = computeAbsoluteRatioDiff(curr.width, minSize);
    return curr.width != null && currDiff < prevDiff && curr.width >= minSize
      ? curr
      : prev;
  });
  console.log({ appropriateImage });
  return appropriateImage.url;
};
