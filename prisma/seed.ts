import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../src/generated/prisma/client.ts';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

type TSeedCounts = {
  readonly users: number;
  readonly sponsors: number;
  readonly bounties: number;
  readonly grants: number;
};

const createAdapter = (): PrismaMariaDb => {
  const dbUrl = new URL(process.env.DATABASE_URL!);

  return new PrismaMariaDb({
    host: dbUrl.hostname,
    port: Number(dbUrl.port || 3306),
    user: decodeURIComponent(dbUrl.username),
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.replace(/^\//, ''),
    connectionLimit: 5,
    allowPublicKeyRetrieval: true,
    ssl: false,
  });
};

const prisma = new PrismaClient({
  adapter: createAdapter(),
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

const getDatabaseName = (): string => {
  const dbUrl = new URL(process.env.DATABASE_URL!);
  return dbUrl.pathname.replace(/^\//, '');
};

const getTableColumns = async (tableName: string): Promise<Set<string>> => {
  const dbName = getDatabaseName();
  const rows = (await prisma.$queryRawUnsafe(
    'SELECT COLUMN_NAME AS columnName FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
    dbName,
    tableName,
  )) as Array<{ columnName: string }>;

  return new Set(rows.map((row) => row.columnName));
};

const toSqlValue = (value: unknown): string => {
  if (value === null || value === undefined) return 'NULL';
  if (value instanceof Date) return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`;
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'NULL';
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (typeof value === 'object') {
    const json = JSON.stringify(value);
    return `'${json.replace(/'/g, "''")}'`;
  }
  return `'${String(value).replace(/'/g, "''")}'`;
};

const upsertRow = async (params: {
  readonly tableName: string;
  readonly data: Record<string, unknown>;
  readonly uniqueColumns: string[];
}): Promise<void> => {
  const columns = await getTableColumns(params.tableName);
  const rawData = { ...params.data };
  if (columns.has('id') && rawData.id === undefined) {
    rawData.id = randomUUID();
  }

  const filteredEntries = Object.entries(rawData).filter(([key]) =>
    columns.has(key),
  );

  if (filteredEntries.length === 0) return;

  const columnNames = filteredEntries.map(([key]) => `\`${key}\``).join(', ');
  const values = filteredEntries.map(([, value]) => toSqlValue(value)).join(', ');
  const updateEntries = filteredEntries
    .filter(([key]) => !params.uniqueColumns.includes(key))
    .map(([key]) => `\`${key}\` = VALUES(\`${key}\`)`)
    .join(', ');

  const sql = `INSERT INTO \`${params.tableName}\` (${columnNames}) VALUES (${values}) ON DUPLICATE KEY UPDATE ${updateEntries || `${columnNames.split(', ')[0]} = ${columnNames.split(', ')[0]}`}`;
  await prisma.$executeRawUnsafe(sql);
};

const getSingleValue = async (
  sql: string,
  ...args: unknown[]
): Promise<string | null> => {
  const rows = (await prisma.$queryRawUnsafe(sql, ...args)) as Array<
    Record<string, unknown>
  >;
  if (!rows[0]) return null;
  const firstValue = Object.values(rows[0])[0];
  return firstValue ? String(firstValue) : null;
};

const seedUserAndSponsor = async (): Promise<{
  readonly userId: string;
  readonly sponsorId: string;
}> => {
  await upsertRow({
    tableName: 'User',
    uniqueColumns: ['email'],
    data: {
      email: 'sponsor@a36labs.com',
      privyDid: 'did:privy:a36labs-sponsor-seed',
      username: 'a36labs',
      role: 'GOD',
      isTalentFilled: true,
      firstName: 'A36',
      lastName: 'Labs',
      updatedAt: new Date(),
    },
  });

  await upsertRow({
    tableName: 'Sponsors',
    uniqueColumns: ['slug'],
    data: {
      name: 'A36 Labs',
      slug: 'a36-labs',
      bio: 'A36 Labs is a global builder ecosystem — connecting serious builders to protocols, capital, and real work across Web3, AI, and frontier tech.',
      url: 'https://a36labs.com',
      logo: 'https://placehold.co/200x200/18261F/F9B012?text=A36',
      twitter: 'a36labs',
      isVerified: true,
      industry: 'Ecosystem',
      updatedAt: new Date(),
    },
  });

  const userId = await getSingleValue(
    'SELECT id FROM `User` WHERE email = ? LIMIT 1',
    'sponsor@a36labs.com',
  );
  const sponsorId = await getSingleValue(
    'SELECT id FROM `Sponsors` WHERE slug = ? LIMIT 1',
    'a36-labs',
  );

  if (!userId || !sponsorId) {
    throw new Error('Failed to resolve seeded user/sponsor IDs');
  }

  await prisma.$executeRawUnsafe(
    'UPDATE `User` SET currentSponsorId = ? WHERE id = ?',
    sponsorId,
    userId,
  );

  await upsertRow({
    tableName: 'UserSponsors',
    uniqueColumns: ['userId', 'sponsorId'],
    data: {
      userId,
      sponsorId,
      role: 'ADMIN',
      updatedAt: new Date(),
    },
  });

  return { userId, sponsorId };
};

const seedBounties = async (input: {
  readonly sponsorId: string;
  readonly userId: string;
}): Promise<void> => {
  const deadline30Days = new Date(Date.now() + THIRTY_DAYS_MS);

  await upsertRow({
    tableName: 'Bounties',
    uniqueColumns: ['slug'],
    data: {
      title: 'Write a Deep Dive: Top Web3 Infrastructure Projects',
      slug: 'deep-dive-web3-infrastructure',
      description:
        'Research and write a 1,500-word deep dive covering 3 high-signal Web3 infrastructure projects. Cover: what they build, why it matters, who is building on top. No hype. Signal only.',
      sponsorId: input.sponsorId,
      pocId: input.userId,
      token: 'USDC',
      rewardAmount: 200,
      status: 'OPEN',
      deadline: deadline30Days,
      skills: ['Content', 'Research', 'Web3'],
      type: 'bounty',
      isPublished: true,
      isActive: true,
      isArchived: false,
      region: 'Global',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await upsertRow({
    tableName: 'Bounties',
    uniqueColumns: ['slug'],
    data: {
      title: 'Design A36 Earn Brand Asset Pack',
      slug: 'a36-earn-brand-assets',
      description:
        'Create a full brand asset pack for A36 Earn. Deliverables: social banner (1500x500), Twitter card (1200x628), email header (600x200), and a set of 6 skill/category icons. Use A36 brand colors and Montserrat font. Submit as Figma link + exported PNGs.',
      sponsorId: input.sponsorId,
      pocId: input.userId,
      token: 'USDC',
      rewardAmount: 300,
      status: 'OPEN',
      deadline: deadline30Days,
      skills: ['Design', 'Figma', 'Branding'],
      type: 'bounty',
      isPublished: true,
      isActive: true,
      isArchived: false,
      region: 'Global',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await upsertRow({
    tableName: 'Bounties',
    uniqueColumns: ['slug'],
    data: {
      title: 'Build a Reusable Web3 Wallet Connect Component',
      slug: 'web3-wallet-connect-component',
      description:
        'Build a production-ready React wallet connect component. Requirements: supports existing wallet connection (MetaMask, Phantom) AND auto-generates a new wallet for users without one. Must be TypeScript, fully accessible (WCAG AA), and mobile-responsive. Submit as a GitHub repo with README and live demo.',
      sponsorId: input.sponsorId,
      pocId: input.userId,
      token: 'USDC',
      rewardAmount: 500,
      status: 'OPEN',
      deadline: deadline30Days,
      skills: ['React', 'TypeScript', 'Web3', 'Solana'],
      type: 'bounty',
      isPublished: true,
      isActive: true,
      isArchived: false,
      region: 'Global',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};

const seedGrant = async (input: {
  readonly sponsorId: string;
  readonly userId: string;
}): Promise<void> => {
  await upsertRow({
    tableName: 'Grants',
    uniqueColumns: ['slug'],
    data: {
      title: 'A36 Ecosystem Builder Grant',
      slug: 'a36-ecosystem-builder-grant',
      description:
        "Open grant for builders creating tools, content, or products that benefit the A36 Labs ecosystem. Submit a short proposal (max 500 words) with: what you're building, why it matters to the A36 network, and a 4-week timeline. Serious applicants only.",
      sponsorId: input.sponsorId,
      pocId: input.userId,
      token: 'USDC',
      minReward: 1000,
      maxReward: 1000,
      status: 'OPEN',
      skills: ['Open', 'Web3', 'AI', 'Development'],
      isPublished: true,
      isActive: true,
      isArchived: false,
      region: 'Global',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};

const getCounts = async (): Promise<TSeedCounts> => {
  const [users, sponsors, bountyRows, grantRows] = await Promise.all([
    getSingleValue('SELECT COUNT(*) AS total FROM `User`'),
    getSingleValue('SELECT COUNT(*) AS total FROM `Sponsors`'),
    getSingleValue(
      "SELECT COUNT(*) AS total FROM `Bounties` WHERE slug IN ('deep-dive-web3-infrastructure', 'a36-earn-brand-assets', 'web3-wallet-connect-component')",
    ),
    getSingleValue(
      "SELECT COUNT(*) AS total FROM `Grants` WHERE slug = 'a36-ecosystem-builder-grant'",
    ),
  ]);

  return {
    users: Number(users || 0),
    sponsors: Number(sponsors || 0),
    bounties: Number(bountyRows || 0),
    grants: Number(grantRows || 0),
  };
};

const main = async (): Promise<void> => {
  const ids = await seedUserAndSponsor();
  await seedBounties(ids);
  await seedGrant(ids);

  const counts = await getCounts();
  console.log(`Seed complete -> users: ${counts.users}`);
  console.log(`Seed complete -> sponsors: ${counts.sponsors}`);
  console.log(`Seed complete -> bounties: ${counts.bounties}`);
  console.log(`Seed complete -> grants: ${counts.grants}`);
};

main()
  .catch((error: unknown) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
