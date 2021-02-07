import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { App } from '~/entities';

dayjs.extend(relativeTime);

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
