import Redis from 'ioredis';
import { REDIS_URL, REDIS_PORT, REDIS_PASSWORD } from '@/config/constants';
import { logger } from 'shared/logger';

const client = new Redis(REDIS_URL, {
  port: REDIS_PORT != null
    ? parseInt(REDIS_PORT, 10)
    : undefined,
  password: REDIS_PASSWORD,
});

client.on('connect', () => {
  logger.info('✅ Redis client has connected.\n');
});

client.on('error', (err: Error) => {
  logger.error('❌ Redis client could not connect.', err, {
    REDIS_URL,
    REDIS_PORT,
    password: REDIS_PASSWORD ? 'Password is set' : 'Password is not set.',
  });
});

export default client;
