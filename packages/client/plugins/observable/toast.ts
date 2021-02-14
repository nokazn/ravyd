import type { Plugin } from '@nuxt/types';
import { $toast } from '~/observable/toast';

export type { ToastType, $Toast } from '~/observable/toast';

const injector: Plugin = (_, inject) => {
  inject('toast', $toast);
};

export default (injector);
