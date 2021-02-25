// destructuring assignment は使わない (process.env のプロパティに生えてるわけではない)
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN as string;
export const SERVER_ORIGIN = process.env.SERVER_ORIGIN as string;
export const PORT = process.env.PORT ?? 3000;
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const PROXY_API_PREFIX = '/api';
export const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
export const APP_NAME = 'Ravyd';
