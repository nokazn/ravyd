import session from 'express-session';
import dotenv from 'dotenv';
import connectRedis from 'connect-redis';

import client from '../../db/redis';

dotenv.config();

if (process.env.SESSION_SECRET == null) {
  console.error(process.env);
  throw new Error('セッションIDを署名するための seed が設定されていません。');
}

const RedisStore = connectRedis(session);

export default session({
  secret: process.env.SESSION_SECRET,
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
    maxAge: 1000 * 60 * 60 * 24 * 365,
  },
});
