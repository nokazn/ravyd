import type { Plugin } from '@nuxt/types';
import { $screen } from '~/observable/screen';

export type { $Screen, DeviceType } from '~/observable/screen';

const injector: Plugin = (_, inject) => {
  inject('screen', $screen);
};

export default injector;
