import 'dotenv/config';

import { defineConfig, env } from 'prisma/config';

// A36 Earn — Prisma Config
// Target: MySQL 8.0 (Local dev via MySQL Community Server)
// NO PlanetScale adapter. NO Edge runtime.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node --esm prisma/seed.ts',
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
