import { PrismaClient } from '@/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaPg } from '@prisma/adapter-pg';

// Prevent multiple PrismaClient instances in development
// This is critical for serverless environments and hot-reloading
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
        'Please configure your PostgreSQL connection string.'
    );
  }

  const logConfig = process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'];

  // Use Neon adapter for Neon serverless connections, PrismaPg for standard PostgreSQL
  const adapter = connectionString.includes('neon.tech')
    ? new PrismaNeon({ connectionString })
    : new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log: logConfig as ('query' | 'error' | 'warn')[],
  });
}

// Use cached client in development, fresh client in production
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Cache the client in development to prevent connection exhaustion
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown handler
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}
