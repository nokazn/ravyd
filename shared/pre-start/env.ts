import fs from 'fs';
import path from 'path';
import dotenv, { DotenvConfigOutput } from 'dotenv';
import { path as ROOT_PATH } from 'app-root-path';
import { logger } from 'shared/logger';

export const loadEnv = (relativePath: string): DotenvConfigOutput | undefined => {
  const p = path.join(ROOT_PATH, relativePath);
  let result: DotenvConfigOutput | undefined;
  if (fs.existsSync(p)) {
    result = dotenv.config({ path: p });
    if (result.error != null) {
      throw result.error;
    }
  } else {
    logger.warn(`No .env file found at '${p}'.`);
  }

  return result;
};

// 候補の配列の内すべての要素が process.env に存在するものがあればチェックを通す
export const checkEnv = (...candidates: string[][]): [boolean, NodeJS.ProcessEnv] => {
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
