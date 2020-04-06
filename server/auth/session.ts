import session from 'express-session';

export default session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    // 本番環境の場合は https のみ許可
    secure: process.env.NODE_ENV === 'production',
    sameSite: true,
    // 10分のみ有効
    maxAge: 1000 * 60 * 10,
  },
});
