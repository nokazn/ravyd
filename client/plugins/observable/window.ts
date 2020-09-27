import type { Plugin } from '@nuxt/types';
import { $window } from '~/observable/window';

export type { $Window } from '~/observable/window';

const injector: Plugin = (_, inject) => {
  inject('header', $window);
};

export default injector;
