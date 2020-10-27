import type { Plugin } from '@nuxt/types';
import { $keyboard } from '~/observable/keyboard';

export type { Listener, EventListenerMap, $Keyboard } from '~/observable/keyboard';

const injector: Plugin = (_, inject) => {
  inject('keyboard', $keyboard);
};

export default (injector);
