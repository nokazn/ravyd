/* eslint-disable no-param-reassign */
import { Plugin } from '@nuxt/types';

const injectStoreIntoNuxt: Plugin = (context) => {
  context.$state = context.store.state;
  context.$getters = context.store.getters;
  context.$commit = context.store.commit;
  context.$dispatch = context.store.dispatch;
};

export default injectStoreIntoNuxt;
