import Redis from 'ioredis';

import { logger } from 'shared/logger';
import { REDIS_URL, REDIS_PORT, REDIS_PASSWORD } from '@/config/constants';

const client = new Redis(REDIS_URL, {
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
});

client.on('connect', () => {
  logger.info('✅ Redis client has connected.\n');
});

client.on('error', (err: Error) => {
  logger.error('❌ Redis client could not connect.', {
    err,
    REDIS_URL,
    REDIS_PORT,
    password: REDIS_PASSWORD ? 'Password is set' : 'Password is not set.',
  });
});

export default client;
