import { Plugin } from '@nuxt/types';
import { $overlay } from '~/observable/overlay';

export { Overlay } from '~/observable/overlay';

const injectOverlay: Plugin = (_, inject) => {
  inject('overlay', $overlay);
};

export default (injectOverlay);
