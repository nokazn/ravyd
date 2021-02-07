export const {
  BASE_ORIGIN,
  PORT,
  REDIS_PORT,
  REDIS_PASSWORD,
  SESSION_SECRET,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} = process.env as Record<string, string>;

export const SPOTIFY_TOKEN_BASE_URL = 'https://accounts.spotify.com/api/token';
export const SPOTIFY_AUTHORIZE_BASE_URL = 'https://accounts.spotify.com/authorize';

export const CSRF_STATE_COOKIE_KEY = 'csrf_state';
export const AUTH_STATE_COOKIE_KEY = 'auth_state';

// 20分でトークンを更新させる
export const TOKEN_EXPIRE_IN = 1000 * 60 * 20;
