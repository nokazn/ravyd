export const elapsedTimeInJapanese = (timeMs: number): string => {
  const timeSeconds = timeMs / 1000;
  const hours = Math.floor(timeSeconds / 60 / 60);
  const remainingTimeSeconds = timeSeconds - 60 * 60 * hours;
  const minutes = Math.floor(remainingTimeSeconds / 60);
  const seconds = Math.floor(remainingTimeSeconds - 60 * minutes);

  if (hours > 0) return `${hours}時間${minutes}分`;
  if (minutes > 0) return `${minutes}分${seconds}秒`;
  return `${seconds}秒`;
};
