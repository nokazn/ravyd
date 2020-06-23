/* eslint-disable no-param-reassign */
import { Plugin } from '@nuxt/types';

const injectVuex: Plugin = (context, inject) => {
  inject('state', () => context.store.state);
  inject('getters', () => context.store.getters);
  inject('commit', context.store.commit);
  inject('dispatch', context.store.dispatch);
};

export default injectVuex;
