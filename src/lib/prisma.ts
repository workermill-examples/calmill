// PrismaClient singleton with PrismaNeon adapter for Prisma 7
// Uses Pool-based pattern proven in previous CalMill build

import { PrismaClient } from "@/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Node 24 has a built-in WebSocket that is INCOMPATIBLE with Neon.
// Must use the ws npm package directly — no factory, no typeof checks.
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL || process.env.DIRECT_DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL or DIRECT_DATABASE_URL must be set. " +
      `DATABASE_URL is ${process.env.DATABASE_URL ? "set" : "MISSING"}, ` +
      `DIRECT_DATABASE_URL is ${process.env.DIRECT_DATABASE_URL ? "set" : "MISSING"}`
    );
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool as any) as any;

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
