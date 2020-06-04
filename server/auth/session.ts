import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.SESSION_SECRET == null) {
  console.error(process.env);
  throw new Error('セッションIDを署名するための seed が設定されていません。');
}

export default session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // 本番環境の場合は https のみ許可
    secure: process.env.NODE_ENV === 'production',
    sameSite: true,
    // 10分のみ有効
    maxAge: 1000 * 60 * 1,
  },
});
