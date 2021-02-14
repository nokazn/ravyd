import type { Plugin } from '@nuxt/types';

import { spotify } from '~/services/spotify';

const injector: Plugin = (context, inject) => {
  inject('spotify', spotify(context));
};

export default injector;
