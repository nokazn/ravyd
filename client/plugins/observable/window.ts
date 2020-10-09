import type { Plugin } from '@nuxt/types';
import { $screen } from '~/observable/window';

export type { $Screen, DeviceType } from '~/observable/window';

const injector: Plugin = (_, inject) => {
  inject('screen', $screen);
};

export default injector;
