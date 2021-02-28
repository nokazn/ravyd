import fp from 'fastify-plugin';
import fastifyCors from 'fastify-cors';
import type { FastifyPluginCallback } from 'fastify';

import { ALLOWED_ORIGIN } from '@/config/constants';

const cb: FastifyPluginCallback = (app, _, done) => {
  app.register(fastifyCors, {
    origin: ALLOWED_ORIGIN,
    credentials: true,
  });

  done();
};

export const cors = fp(cb);
