import Redis from 'ioredis';

const client = new Redis({
  host: process.env.REDIS_URL,
});

client.on('connect', () => {
  console.log('Redis client connected. 🎉\n');
});

client.on('error', (e: Error) => {
  console.error('Redis client could not connect.', e);
});

export default client;
