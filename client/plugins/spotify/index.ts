import { Plugin } from '@nuxt/types';

import { endpoints } from './endpoints';

const plugin: Plugin = (context, inject) => {
  inject('spotify', endpoints(context));
};

export default plugin;
