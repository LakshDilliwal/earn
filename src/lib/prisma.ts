// =============================================================================
// A36 Earn — Prisma Client Singleton
// Standard Node.js MySQL client. No PlanetScale adapter. No Edge runtime.
// =============================================================================
import { PrismaClient } from '../generated/prisma/client.ts';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClient = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
});

export const prisma =
  globalForPrisma.prisma ??
  prismaClient;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
