import type { Plugin } from '@nuxt/types';

import { endpoints } from './endpoints';

const injector: Plugin = (context, inject) => {
  inject('server', endpoints(context));
};

export default injector;
