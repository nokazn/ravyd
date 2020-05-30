import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { App } from '~~/types';

dayjs.extend(relativeTime);

export const convertAddedAt = (addedAt: string): App.AddedAtInfo => {
  const moment = dayjs(addedAt);
  const diff = Date.now() - moment.valueOf();
  const overTwoWeeksAgo = diff > 14 * 24 * 60 * 60 * 1000;

  return {
    fromNow: moment.fromNow(),
    yyyymd: moment.format('YYYY/M/d'),
    title: moment.format('YYYY/M/d H:mm'),
    overTwoWeeksAgo,
  };
};
