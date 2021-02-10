const ENV = process.env as Record<string, string>;
export const {
  CLIENT_ORIGIN,
  REDIS_URL,
  REDIS_PORT,
  REDIS_PASSWORD,
  SESSION_SECRET,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} = ENV;
export const PORT = parseInt(ENV.PORT, 10);

export const SPOTIFY_AUTHORIZE_BASE_URL = 'https://accounts.spotify.com';

export const AUTH_STATE_COOKIE_KEY = 'auth_state';

// 20分でトークンを更新させる
export const TOKEN_EXPIRE_IN = 1000 * 60 * 20;
