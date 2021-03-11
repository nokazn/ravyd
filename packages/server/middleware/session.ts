import fp from 'fastify-plugin';
import fastifySession from 'fastify-session';
import connectRedis from 'connect-redis';
import type { FastifyPluginCallback } from 'fastify';

import client from '@/redis';
import { httpsServerOptions } from '@/config/https';
import { CLIENT_ORIGIN, IS_PRODUCTION, SESSION_SECRET } from '@/config/constants';

const cb: FastifyPluginCallback = (app, _, done) => {
  // TODO:
  const RedisStore = connectRedis(fastifySession as any);

  app.register(fastifySession, {
    secret: SESSION_SECRET,
    // resave: false,
    saveUninitialized: true,
    // X-Forwarded-Proto ヘッダーがある場合リバースプロキシを信頼する
    // proxy: true,
    // アクセスの度に有効期限を更新
    // rolling: true,
    store: new RedisStore({ client }),
    cookie: {
      secure: IS_PRODUCTION || httpsServerOptions != null,
      httpOnly: true,
      sameSite: 'lax',
      // production ではサブドメインにも許可
      domain: IS_PRODUCTION
        ? CLIENT_ORIGIN.replace(/^https?:\/\//, '').replace(/\/+$/, '')
        : undefined,
      // 1年間
      maxAge: 60 * 24 * 60 * 60 * 1000,
    },
  });

  done();
};

export const session = fp(cb);
