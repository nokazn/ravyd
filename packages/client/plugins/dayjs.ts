import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ja';
import type { Plugin } from '@nuxt/types';

const injector: Plugin = (_, inject) => {
  dayjs.locale('ja');
  dayjs.extend(relativeTime);
  inject('dayjs', dayjs);
};

export default injector;
