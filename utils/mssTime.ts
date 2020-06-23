export const mssTime = (timeMs: number): string => {
  const timeSeconds = timeMs / 1000;
  const minutes = Math.floor(timeSeconds / 60);
  const seconds = Math.floor(timeSeconds - 60 * minutes);

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
