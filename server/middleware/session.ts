import sessionMiddleware from 'express-session';
import connectRedis from 'connect-redis';

import { SESSION_SECRET } from '@/config/constants';
import client from '~~/db/redis';

const RedisStore = connectRedis(sessionMiddleware);

export const session = sessionMiddleware({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  // X-Forwarded-Proto ヘッダーがある場合リバースプロキシを信頼する
  proxy: true,
  // アクセスの度に有効期限を更新
  rolling: true,
  store: new RedisStore({ client }),
  cookie: {
    // HTTPS 通信でのみ送信
    secure: true,
    // クライアントサイドのJSから読めないようにする
    httpOnly: true,
    // 同一オリジンでのみ Cookie を送信
    sameSite: 'strict',
    // 1年間
    maxAge: 60 * 24 * 60 * 60 * 1000,
  },
});
