/* eslint-disable no-param-reassign */
import type { Plugin } from '@nuxt/types';
import type { ExtendedSubscribe } from 'typed-vuex';

const injectVuex: Plugin = (context, inject) => {
  inject('state', () => context.store.state);
  inject('getters', () => context.store.getters);
  inject('commit', context.store.commit);
  inject('dispatch', context.store.dispatch);

  // @todo 第二引数で this._subscribers を参照させる必要がある
  inject('subscribe', (
    fn: Parameters<ExtendedSubscribe>[0],
    option: Parameters<ExtendedSubscribe>[1],
  ) => (context.store.subscribe as any)(fn, context.store.subscribe, option));
};

export default injectVuex;
