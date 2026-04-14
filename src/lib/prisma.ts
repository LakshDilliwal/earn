// =============================================================================
// A36 Earn — Prisma Client Singleton
// Prisma 7 + MySQL 8.0, engineType = library
// No adapter needed for standard MySQL with library engine
// =============================================================================
import { PrismaClient } from '../generated/prisma/client.ts';

declare const globalThis: {
  prismaGlobal: PrismaClient;
} & typeof global;

const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

export { prisma };
