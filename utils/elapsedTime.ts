const twoDigits = (num: number) => num.toString().padStart(2, '0');

export const elapsedTime = (timeMs: number): string => {
  const timeSeconds = timeMs / 1000;
  const hours = Math.floor(timeSeconds / 60 / 60);
  const remainingTimeSeconds = timeSeconds - 60 * 60 * hours;
  const minutes = Math.floor(remainingTimeSeconds / 60);
  const seconds = Math.floor(remainingTimeSeconds - 60 * minutes);

  if (hours > 0) return `${hours}:${twoDigits(minutes)}:${twoDigits(seconds)}`;
  return `${minutes}:${twoDigits(seconds)}`;
};
