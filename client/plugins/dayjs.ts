import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import type { Plugin } from '@nuxt/types';

const injectDayjs: Plugin = (_context, inject) => {
  dayjs.locale('ja');
  inject('dayjs', dayjs);
};

export default (injectDayjs);
