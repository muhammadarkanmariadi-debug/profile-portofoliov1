import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool, PoolConfig } from 'pg';

const databaseUrl = process.env.DATABASE_URL;

const isSslDisabled =
  process.env.DATABASE_SSL === 'false' ||
  process.env.DATABASE_HOST === 'postgres' ||
  process.env.DATABASE_HOST === 'localhost' ||
  process.env.DATABASE_HOST === '127.0.0.1' ||
  (databaseUrl && (databaseUrl.includes('@postgres:') || databaseUrl.includes('@localhost:') || databaseUrl.includes('@127.0.0.1:') || databaseUrl.includes('sslmode=disable')));

let poolConfig: PoolConfig;

if (databaseUrl) {
  poolConfig = {
    connectionString: databaseUrl,
    ssl: isSslDisabled ? false : { rejectUnauthorized: false },
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
  };
} else {
  poolConfig = {
    host: process.env.DATABASE_HOST ?? 'postgres',
    port: Number(process.env.DATABASE_PORT ?? 5432),
    user: process.env.DATABASE_USER ?? 'postgres',
    password: process.env.DATABASE_PASSWORD ?? 'postgres',
    database: process.env.DATABASE_NAME ?? 'profile_db',
    ssl: isSslDisabled ? false : { rejectUnauthorized: false },
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
  };
}

// Connection pool native untuk PostgreSQL
const pool = new Pool(poolConfig);

// Adapter Prisma Postgres
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
