import type { Options } from 'http-proxy-middleware';

import { httpsAgent } from './httpsAgent';
import { CLIENT_ORIGIN, SERVER_ORIGIN, PROXY_API_PREFIX } from './constants';

export const proxy: Options = {
  target: SERVER_ORIGIN,
  changeOrigin: true,
  ws: false,
  agent: httpsAgent,
  pathRewrite: {
    [`^${PROXY_API_PREFIX}`]: '',
  },
  router: {
    [CLIENT_ORIGIN]: SERVER_ORIGIN,
  },
};
