import Redis from 'ioredis';
import config from './index';
import { logger } from '../utils/logger';

let redis: Redis | null = null;

export const getRedis = (): Redis => {
  if (!redis) {
    redis = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      maxRetriesPerRequest: null,
      retryStrategy: (times: number) => {
        if (times > 3) {
          logger.warn('Redis retry limit reached, running without cache');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
    });

    redis.on('connect', () => logger.info('Redis connected'));
    redis.on('error', (err) => logger.error('Redis error:', err));
  }
  return redis;
};

export const cacheGet = async (key: string): Promise<string | null> => {
  try {
    const client = getRedis();
    return await client.get(key);
  } catch {
    return null;
  }
};

export const cacheSet = async (key: string, value: string, ttlSeconds = 3600): Promise<void> => {
  try {
    const client = getRedis();
    await client.setex(key, ttlSeconds, value);
  } catch {
    // cache miss is non-fatal
  }
};

export const cacheDel = async (key: string): Promise<void> => {
  try {
    const client = getRedis();
    await client.del(key);
  } catch {
    // cache miss is non-fatal
  }
};

export const cacheDelPattern = async (pattern: string): Promise<void> => {
  try {
    const client = getRedis();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch {
    // cache miss is non-fatal
  }
};
