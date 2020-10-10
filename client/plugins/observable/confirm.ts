import type { Plugin } from '@nuxt/types';
import { $confirm } from '~/observable/confirm';

export type { $Confirm } from '~/observable/confirm';

const injector: Plugin = (_, inject) => {
  inject('confirm', $confirm);
};

export default injector;
