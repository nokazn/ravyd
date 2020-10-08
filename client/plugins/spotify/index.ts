import type { Plugin } from '@nuxt/types';

import { endpoints } from './endpoints';

const injector: Plugin = (context, inject) => {
  inject('spotify', endpoints(context));
};

export default injector;
