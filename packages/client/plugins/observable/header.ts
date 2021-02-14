import type { Plugin } from '@nuxt/types';
import { $header } from '~/observable/header';

export type { $Header } from '~/observable/header';

const injector: Plugin = (_, inject) => {
  inject('header', $header);
};

export default injector;
