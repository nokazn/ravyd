import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import type { Plugin } from '@nuxt/types';

const injector: Plugin = (_context, inject) => {
  dayjs.locale('ja');
  inject('dayjs', dayjs);
};

export default (injector);
