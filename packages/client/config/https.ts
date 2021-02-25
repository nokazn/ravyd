import * as fs from 'fs';
import type { NuxtOptions } from '@nuxt/types';
import { projectRoot } from './path';

const loadCertFile = (fileName: string) => {
  const p = projectRoot(fileName);
  if (fs.existsSync(p)) {
    return fs.readFileSync(p);
  }
  if (process.env.NODE_ENV === 'development') {
    console.warn(`"${fileName}" doesn't exist at "${p}".`);
  }
  return undefined;
};

export const https: NuxtOptions['server']['https'] = (() => {
  if (process.env.LOCAL_HTTPS !== 'true') {
    return undefined;
  }
  const key = loadCertFile('localhost-key.pem');
  const cert = loadCertFile('localhost.pem');
  return key != null && cert != null
    ? { key, cert }
    : undefined;
})();
