import { loadEnv, checkEnv } from '../../shared/pre-start/env';
import { logger } from '../../shared/logger';

(() => {
  const e = process.env.NODE_ENV ?? 'development';
  const result = loadEnv(`server/.env.${e}`);

  const [isValid, env] = checkEnv([
    'CLIENT_ORIGIN',
    'PORT',
    'REDIS_URL',
    'REDIS_PORT',
    'REDIS_PASSWORD',
    'SESSION_SECRET',
    'SPOTIFY_CLIENT_ID',
    'SPOTIFY_CLIENT_SECRET',
  ]);
  if (!isValid) {
    logger.error({
      result,
      isValid,
      env,
    });
    throw new Error('Environmental variables are not set correctly.');
  }
})();
