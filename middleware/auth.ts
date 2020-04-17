import { Middleware } from '@nuxt/types';

const middleware:Middleware = ({ app, route, redirect }) => {
  const isLoggedin = app.$getters()['auth/isLoggedin'];
  if (route.path === '/login/callback') {
    return;
  }

  if (!isLoggedin && route.path !== '/login') {
    redirect('/login');
  } else if (isLoggedin && route.path === '/login') {
    redirect(route.query.redirect as string || '/');
  }
};

export default middleware;
