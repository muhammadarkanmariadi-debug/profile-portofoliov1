import Redis, { RedisOptions } from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;
const DEFAULT_TTL = Number(process.env.REDIS_CACHE_TTL || 3600); // Default 1 hour

const globalForRedis = globalThis as unknown as {
  redisClient: Redis | null | undefined;
  isRedisConnected: boolean;
};

let isConnected = false;

function createRedisClient(): Redis | null {
  if (!REDIS_URL && !process.env.REDIS_HOST) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[Redis] No REDIS_URL or REDIS_HOST provided. Running without Redis cache (graceful fallback).');
    }
    return null;
  }

  const options: RedisOptions = {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) {
        // Stop retrying quickly if Redis is unreachable
        return null;
      }
      return Math.min(times * 100, 1000);
    },
    enableOfflineQueue: false,
    connectTimeout: 5000,
  };

  let client: Redis;

  try {
    if (REDIS_URL) {
      client = new Redis(REDIS_URL, options);
    } else {
      client = new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT || 6379),
        password: process.env.REDIS_PASSWORD || undefined,
        ...options,
      });
    }

    client.on('connect', () => {
      isConnected = true;
      globalForRedis.isRedisConnected = true;
      if (process.env.NODE_ENV !== 'production') {
        console.log('[Redis] Connected successfully.');
      }
    });

    client.on('ready', () => {
      isConnected = true;
      globalForRedis.isRedisConnected = true;
    });

    client.on('error', (err) => {
      isConnected = false;
      globalForRedis.isRedisConnected = false;
      // Suppress repeated unhandled error output in dev
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[Redis Warning] ${err.message}`);
      }
    });

    client.on('close', () => {
      isConnected = false;
      globalForRedis.isRedisConnected = false;
    });

    // Initiate connection asynchronously
    client.connect().catch((err) => {
      isConnected = false;
      globalForRedis.isRedisConnected = false;
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[Redis Connection Failed] ${err.message}. Graceful fallback active.`);
      }
    });

    return client;
  } catch (error) {
    console.warn('[Redis Init Failed]', error);
    return null;
  }
}

export const redis = globalForRedis.redisClient ?? createRedisClient();

if (process.env.NODE_ENV !== 'production' && redis) {
  globalForRedis.redisClient = redis;
}

export function isRedisAvailable(): boolean {
  return isConnected || Boolean(globalForRedis.isRedisConnected);
}

/**
 * Get cached JSON value by key
 */
export async function redisGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (err) {
    // Non-blocking fallback
    return null;
  }
}

/**
 * Set cached JSON value with optional TTL (in seconds)
 */
export async function redisSet(
  key: string,
  value: unknown,
  ttlSeconds: number = DEFAULT_TTL
): Promise<void> {
  if (!redis) return;
  try {
    const serialized = JSON.stringify(value);
    if (ttlSeconds > 0) {
      await redis.set(key, serialized, 'EX', ttlSeconds);
    } else {
      await redis.set(key, serialized);
    }
  } catch (err) {
    // Non-blocking fallback
  }
}

/**
 * Delete one or more specific keys
 */
export async function redisDel(...keys: string[]): Promise<void> {
  if (!redis || keys.length === 0) return;
  try {
    await redis.del(...keys);
  } catch (err) {
    // Non-blocking fallback
  }
}

/**
 * Delete keys matching a pattern (e.g., 'projects:*')
 */
export async function redisDelByPattern(pattern: string): Promise<void> {
  if (!redis) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (err) {
    // Non-blocking fallback
  }
}
