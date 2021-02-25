import { Agent } from 'https';
import { IS_DEVELOPMENT } from './constants';

// 自己証明書によるエラーを回避するため
export const httpsAgent = IS_DEVELOPMENT
  ? new Agent({ rejectUnauthorized: false })
  : undefined;
