import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const client = new Redis({
  port: 6379,
  host: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
});

client.on('connect', () => {
  console.log('Redis client connected. 🎉\n');
});

client.on('error', (err: Error) => {
  console.error('Redis client could not connect.', err);
});

export default client;
