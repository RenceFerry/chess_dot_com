import { createClient, RedisClientType } from 'redis';

let redis: RedisClientType;

export default async function getRedis() {
  console.log('hello reids', redis);
  if (!redis) {
    redis = createClient({
      username: 'default',
      password: process.env.REDIS_PASS,
      socket: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT!)
      }
    });

    redis.on('error', err => console.log('Redis Client Error', err));
    
    await redis.connect();
    console.log('connect reids')
  }

  return redis;
}