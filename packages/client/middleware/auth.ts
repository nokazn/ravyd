import type { Middleware } from '@nuxt/types';

const middleware: Middleware = ({ app, route, redirect }) => {
  const isLoggedIn = app.$getters()['auth/isLoggedIn'];
  if (route.path === '/login/callback') {
    return;
  }

  if (!isLoggedIn && route.path !== '/login') {
    redirect('/login');
  } else if (isLoggedIn && route.path === '/login') {
    // TODO:
    redirect(route.query.redirect as string || '/');
  }
};

export default middleware;
