import { Agent } from 'https';
import { IS_DEVELOPMENT, LOCAL_HTTPS } from './constants';

// 自己証明書によるエラーを回避するため
export const httpsAgent = IS_DEVELOPMENT && LOCAL_HTTPS
  ? new Agent({ rejectUnauthorized: false })
  : undefined;
