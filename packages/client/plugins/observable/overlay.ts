import type { Plugin } from '@nuxt/types';
import { $overlay } from '~/observable/overlay';

export type { $Overlay } from '~/observable/overlay';

const injector: Plugin = (_, inject) => {
  inject('overlay', $overlay);
};

export default (injector);
