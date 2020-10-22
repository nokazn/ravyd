import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.REDIS_URL;
const port = process.env.REDIS_PORT;
const password = process.env.REDIS_PASSWORD;

if (host == null) {
  console.error({
    host,
    port,
    password: password ? 'Password is set' : 'Password is not set.',
  });
  throw new Error('An envirionment variable "REDIS_URL" is not set.');
}

const client = new Redis(host, {
  port: port != null
    ? parseInt(port, 10)
    : undefined,
  password,
});

client.on('connect', () => {
  console.info('Redis client has connected. 🎉\n');
});

client.on('error', (err: Error) => {
  console.error('Redis client could not connect.', err);
});

export default client;
