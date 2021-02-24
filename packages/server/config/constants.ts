export * from 'shared/constants';

const ENV = process.env as Record<string, string>;
export const {
  CLIENT_ORIGIN,
  REDIS_URL,
  REDIS_PASSWORD,
  SESSION_SECRET,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} = ENV;
export const PORT = parseInt(ENV.PORT, 10);
export const REDIS_PORT = parseInt(ENV.REDIS_PORT, 10);
export const HOST = process.env.HOST ?? 'localhost';

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const SPOTIFY_AUTHORIZE_BASE_URL = 'https://accounts.spotify.com';

// 20分でトークンを更新させる
export const TOKEN_EXPIRE_IN = 1000 * 60 * 20;
