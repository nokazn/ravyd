import cookie from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const { SESSION_SECRET } = process.env;
if (SESSION_SECRET == null) {
  console.error(process.env);
  throw new Error('セッションIDを署名するための seed が設定されていません。');
}

export const cookieParser = cookie(SESSION_SECRET);
