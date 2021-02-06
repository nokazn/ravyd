import path from 'path';
import { path as ROOT_PATH } from 'app-root-path';
import dotenv from 'dotenv';
// 他のモジュールを先に読み込まないようにする
import { logger } from '@/helper/logger';

// 候補の配列の内すべての要素が process.env に存在するものがあればチェックを通す
const checkEnv = (...candidates: string[][]): [boolean, NodeJS.ProcessEnv] => {
  const isValid = candidates.reduce<boolean>((prev, curr) => {
    return prev || curr.every((env) => process.env[env] != null);
  }, false);
  const env = candidates.reduce<NodeJS.ProcessEnv>((prev, curr) => {
    const obj = curr.reduce<NodeJS.ProcessEnv>((p, c) => ({
      ...p,
      [c]: process.env[c],
    }), {});
    return { ...prev, ...obj };
  }, {});

  return [isValid, env];
};

(() => {
  const result = dotenv.config({
    path: path.join(ROOT_PATH, 'server/.env'),
  });
  if (result.error != null) {
    throw result.error;
  }

  const [isValid, env] = checkEnv([
    'BASE_ORIGIN',
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
