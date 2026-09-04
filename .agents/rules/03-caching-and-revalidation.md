# Redis Caching & Mutation Revalidation Rules

## 1. Redis Client Architecture (`lib/redis.ts`)

* **Resilient Singleton**:
  * The Redis client uses `ioredis` with lazy connection (`lazyConnect: true`), connection pooling, and limited retry strategy (`maxRetriesPerRequest: 1`).
  * **Graceful Fallback**: If Redis is not running or `REDIS_URL` is missing, the client logs a notice in development and safely returns `null` on queries without throwing unhandled exceptions.
  * Helper functions available in `lib/redis.ts`:
    * `redisGet<T>(key: string): Promise<T | null>`
    * `redisSet(key: string, value: unknown, ttlSeconds?: number): Promise<void>`
    * `redisDel(...keys: string[]): Promise<void>`
    * `redisDelByPattern(pattern: string): Promise<void>`
    * `isRedisAvailable(): boolean`

## 2. Caching Strategy for Services

* **Key Naming Convention**:
  * List queries: `projects:list:${limit ?? 'all'}`
  * Detail queries: `projects:detail:${slugOrId}`
* **Default TTL**:
  * Configurable via `REDIS_CACHE_TTL` environment variable (default: 3600 seconds / 1 hour).
* **Cache Read-Through Pattern**:
  1. Check Redis via `redisGet<T>(cacheKey)`. If hit, parse and return immediately.
  2. If miss, query Prisma PostgreSQL database.
  3. Store result in Redis via `redisSet(cacheKey, result, CACHE_TTL)`.
  4. Return result.

## 3. Mutation Invalidation & Next.js Revalidation

* **Dual-Layer Invalidation**:
  * Whenever data is mutated (Create, Update, Delete, or GitHub sync), two actions MUST be taken:
    1. **Redis Cache Purge**: Call `await invalidateProjectsCache(idOrSlug)` to delete matching `projects:*` keys.
    2. **Next.js Page Revalidation**: Call `revalidatePath()` for affected routes:
       * `revalidatePath('/')`
       * `revalidatePath('/projects')`
       * `revalidatePath('/projects/[slug]', 'page')` (and specific slug path if available)
* **Mutation Entrypoints**:
  * `app/api/admin/projects/route.ts` (`POST`)
  * `app/api/admin/projects/[id]/route.ts` (`PUT`, `DELETE`)
  * `lib/services/github-sync.service.ts` (`syncGithubRepos()`)
