import type { Plugin } from '@nuxt/types';

const injector: Plugin = ({ app }) => {
  if (app.router != null) {
    app.router.beforeEach((_t, _f, next) => {
      app.$header.hideFab();
      next();
    });
  }
};

export default (injector);
