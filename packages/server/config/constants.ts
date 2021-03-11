import { httpsServerOptions } from './https';

export * from 'shared/constants';

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const ENV = process.env as Record<string, string>;
const appendHttpsProtocol = (url: string) => {
  if (url.match(/^https?:\/\//)) return url;
  const protocol = IS_PRODUCTION || httpsServerOptions != null
    ? 'https'
    : 'http';
  return `${protocol}://${url}`;
};

export const {
  REDIS_URL,
  REDIS_PASSWORD,
  SESSION_SECRET,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} = ENV;
export const CLIENT_ORIGIN = appendHttpsProtocol(ENV.CLIENT_ORIGIN);
export const HOST = process.env.HOST ?? 'localhost';
export const PORT = parseInt(process.env.PORT ?? '5000', 10);
export const REDIS_PORT = parseInt(process.env.REDIS_PORT ?? '6379', 10);
export const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? CLIENT_ORIGIN;

export const SPOTIFY_AUTHORIZE_BASE_URL = 'https://accounts.spotify.com';

// 20分でトークンを更新させる
export const TOKEN_EXPIRE_IN = 1000 * 60 * 20;
