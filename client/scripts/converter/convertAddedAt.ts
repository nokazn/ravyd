import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { App } from '~~/types';

dayjs.extend(relativeTime);

export const convertAddedAt = (addedAt: string): App.AddedAtInfo => {
  const moment = dayjs(addedAt);
  const fromNow = moment.fromNow();
  const fromNowDay = parseFloat(fromNow.replace(/(\d)日前/g, '$1'));

  return {
    fromNow,
    yyyymd: moment.format('YYYY/M/d'),
    title: moment.format('YYYY/M/d H:mm'),
    overTwoWeeksAgo: fromNowDay > 14,
  };
};
