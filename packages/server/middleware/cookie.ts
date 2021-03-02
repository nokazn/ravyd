import fp from 'fastify-plugin';
import fastifyCookie from 'fastify-cookie';
import type { FastifyPluginCallback } from 'fastify';

import { SESSION_SECRET } from '@/config/constants';

const cb: FastifyPluginCallback = (app, _, done) => {
  app.register(fastifyCookie, {
    secret: SESSION_SECRET,
  });

  done();
};

export const cookie = fp(cb);
