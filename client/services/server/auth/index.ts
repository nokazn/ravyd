import type { Context } from '@nuxt/types';

import { root } from './root';
import { login } from './login';
import { callback } from './callback';
import { refresh } from './refresh';
import { logout } from './logout';

export const auth = (context: Context) => ({
  root: root(context),
  login: login(context),
  callback: callback(context),
  refresh: refresh(context),
  logout: logout(context),
});
