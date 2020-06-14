import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.REDIS_URL;
const port = process.env.REDIS_PORT;
const password = process.env.REDIS_PASSWORD;

if (host == null || port == null || password == null) {
  console.error({
    host,
    port,
    password,
  });
  throw new Error('redis 初期化の際に必要な環境変数が設定されていません。');
}

const client = new Redis({
  host,
  port: parseFloat(port),
  password,
});

client.on('connect', () => {
  console.log('Redis client connected. 🎉\n');
});

client.on('error', (err: Error) => {
  console.error('Redis client could not connect.', err);
});

export default client;
