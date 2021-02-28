import { FastifyPluginCallback } from 'fastify';
import { auth } from './auth';
import { login } from './auth/login';
import { callback } from './auth/login/callback';
import { logout } from './auth/logout';
import { refresh } from './auth/refresh';

export * from './auth';

export const router: FastifyPluginCallback = (app, _, done) => {
  app.get('/auth', auth);
  app.post('/auth/login', login);
  app.get('/auth/login/callback', callback);
  app.post('/auth/logout', logout);
  app.put('/auth/refresh', refresh);

  done();
};


