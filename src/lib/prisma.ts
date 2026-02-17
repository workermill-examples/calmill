import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Prevent multiple PrismaClient instances in development
// This is critical for serverless environments and hot-reloading
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Use DATABASE_URL (pooled connection) for Neon
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
      "Please configure your Neon PostgreSQL connection string."
    );
  }

  // Create Prisma adapter for Neon (pass connectionString directly)
  const adapter = new PrismaNeon({ connectionString });

  // Initialize PrismaClient with the adapter
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

// Use cached client in development, fresh client in production
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Cache the client in development to prevent connection exhaustion
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown handler
if (typeof window === "undefined") {
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}
