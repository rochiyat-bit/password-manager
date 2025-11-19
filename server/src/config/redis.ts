import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('connect', () => {
  console.log('✅ Redis connection established successfully.');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

export const connectRedis = async () => {
  try {
    await redis.ping();
    console.log('✅ Redis is ready.');
  } catch (error) {
    console.error('❌ Unable to connect to Redis:', error);
    process.exit(1);
  }
};

export default redis;
