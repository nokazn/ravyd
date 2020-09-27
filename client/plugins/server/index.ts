import type { Plugin } from '@nuxt/types';

import { endpoints } from './endpoints';

const plugin: Plugin = (context, inject) => {
  inject('server', endpoints(context));
};

export default plugin;
