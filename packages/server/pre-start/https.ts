import * as fs from 'fs';
import * as path from 'path';
import type { ServerOptions } from 'https'

const relativeFromRoot = (p: string) => path.join(__dirname, '../../../', p);
const loadCertFile = (fileName: string) => {
  const p = relativeFromRoot(fileName);
  if (fs.existsSync(p)) {
    return fs.readFileSync(p);
  }
  if(process.env.NODE_ENV === 'development') {
    console.warn(`"${fileName}" doesn't exist at "${p}".`);
  }
  return undefined;
};

export const httpsServerOptions: ServerOptions | undefined = (() => {
  if (process.env.LOCAL_HTTPS !== 'true') {
    return undefined;
  }
  const key = loadCertFile('localhost-key.pem');
  const cert = loadCertFile('localhost.pem');
  return key != null && cert != null
    ? { key, cert }
    : undefined;
})()
