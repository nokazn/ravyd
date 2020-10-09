import type { Plugin } from '@nuxt/types';

import { server } from '~/services/server';

const injector: Plugin = (context, inject) => {
  inject('server', server(context));
};

export default injector;
