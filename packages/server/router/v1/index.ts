import { FastifyPluginCallback } from 'fastify';
import { auth } from './auth';
import { login } from './auth/login';
import { callback } from './auth/login/callback';
import { logout } from './auth/logout';
import { refresh } from './auth/refresh';

export const router: FastifyPluginCallback = (app, _, done) => {
  app.get('/auth', { schema: auth.schema }, auth.handler);
  app.post('/auth/login', { schema: login.schema }, login.handler);
  app.get('/auth/login/callback', { schema: callback.schema }, callback.handler);
  app.post('/auth/logout', { schema: logout.schema }, logout.handler);
  app.put('/auth/refresh', { schema: refresh.schema }, refresh.handler);

  done();
};


