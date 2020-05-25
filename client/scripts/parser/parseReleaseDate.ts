import dayjs from 'dayjs';

export const parseReleaseDate = ({ releaseDate, releaseDatePrecision, format }: {
  releaseDate: string
  releaseDatePrecision: 'year' | 'month' | 'day'
  format?: string
}) => {
  // releaseDate のフォーマットと date のフォーマットの配列
  const releaseDateFormat = {
    year: ['YYYY', 'YYYY年'] as const,
    month: ['YYYY-MM', 'YYYY年M月'] as const,
    day: ['YYYY-MM-dd', 'YYYY年M月d日'] as const,
  }[releaseDatePrecision];
  const date = dayjs(releaseDate, releaseDateFormat[0]).format(format ?? releaseDateFormat[1]);

  return date;
};
