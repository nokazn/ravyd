import dayjs from 'dayjs';
import { Plugin } from '@nuxt/types';

const injectDayjs: Plugin = (_context, inject) => {
  inject('dayjs', dayjs);
};

export default (injectDayjs);
