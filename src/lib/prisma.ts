// =============================================================================
// A36 Earn — Prisma Client Singleton
// Prisma 7 + MySQL 8.0 via @prisma/adapter-mysql2
// engineType = "client" requires an adapter — we use mysql2 (zero extra cost)
// =============================================================================
import { PrismaMysql } from '@prisma/adapter-mysql2';
import mysql from 'mysql2/promise';

import { PrismaClient } from '../generated/prisma/client.ts';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const pool = mysql.createPool(process.env.DATABASE_URL!);
  const adapter = new PrismaMysql(pool);
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
