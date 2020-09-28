import type { Plugin } from '@nuxt/types';
import * as constant from '~/constants';

const injector: Plugin = (_, inject) => {
  inject('constant', constant);
};

export type Constant = typeof constant;

export default injector;
