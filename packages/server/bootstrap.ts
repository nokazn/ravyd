// Must be at first line
// eslint-disable-next-line import/order
import './pre-start';

import Fastify from 'fastify';
import helmet from 'fastify-helmet';
import type { Server } from 'https';
import type { FastifyInstance, FastifyHttpsOptions, FastifyServerOptions } from 'fastify';

import { logger } from 'shared/logger';
import { cors, cookie, session } from '@/middleware';
import { router } from '@/router/v1';
import { PORT, HOST, SERVER_API_PREFIX } from '@/config/constants';
import { httpsServerOptions } from '@/config';

type FastifyOptions = Omit<FastifyHttpsOptions<Server>, 'https'> & FastifyServerOptions;

const app: FastifyInstance = (() => {
  const options: FastifyOptions = {
    logger,
  };
  if (httpsServerOptions == null) {
    return Fastify(options);
  }

  return Fastify({
    ...options,
    https: httpsServerOptions,
  });
})();

app.register(helmet);
app.register(cors);
app.register(cookie);
app.register(session);
app.register(router, { prefix: SERVER_API_PREFIX });

const start = async () => {
  return app.listen(PORT, HOST)
    .catch((err) => {
      app.log.error('Cloud not start server.', err);
      process.exit(1);
    });
};
start();
