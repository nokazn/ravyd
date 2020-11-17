import type { Plugin } from '@nuxt/types';

const injector: Plugin = ({ app }) => {
  app.router?.beforeEach(() => {
    app.$header.hideFab();
  });
};

export default (injector);
