import { Plugin } from '@nuxt/types';
import { $header } from '~/observable/header';

export { Header } from '~/observable/header';

const injectHeader: Plugin = (_, inject) => {
  inject('header', $header);
};

export default (injectHeader);
