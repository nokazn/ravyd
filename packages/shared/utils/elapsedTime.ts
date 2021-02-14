const twoDigits = (num: number) => num.toString().padStart(2, '0');

// 1時間を超えても m:ss
const mss = (timeMs: number) => {
  if (timeMs === Infinity) return '???';

  const timeSeconds = timeMs / 1000;
  const minutes = Math.floor(timeSeconds / 60);
  const seconds = Math.floor(timeSeconds - 60 * minutes);

  return `${minutes}:${twoDigits(seconds)}`;
};

// 1時間以上の場合は H:mm:ss 、そうでない場合は m:ss
const hmmss = (timeMs: number) => {
  if (timeMs === Infinity) return '???';

  const timeSeconds = timeMs / 1000;
  const hours = Math.floor(timeSeconds / 60 / 60);
  const remainingTimeSeconds = timeSeconds - 60 * 60 * hours;
  const minutes = Math.floor(remainingTimeSeconds / 60);
  const seconds = Math.floor(remainingTimeSeconds - 60 * minutes);

  return hours > 0
    ? `${hours}:${twoDigits(minutes)}:${twoDigits(seconds)}`
    : `${minutes}:${twoDigits(seconds)}`;
};

/**
 * timeMs が Infinity のときは '???' を返す
 * format に hmmss を指定すると、1時間以上の場合は H:mm:ss で表示
 */
export const elapsedTime = (timeMs: number, format: 'mss' | 'hmmss' = 'mss'): string => {
  return format === 'mss'
    ? mss(timeMs)
    : hmmss(timeMs);
};
