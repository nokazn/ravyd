import { Plugin } from '@nuxt/types';
import { $toast } from '~/observable/toast';

export type { ToastType, $Toast } from '~/observable/toast';

const injectToast: Plugin = (_, inject) => {
  inject('toast', $toast);
};

export default (injectToast);
