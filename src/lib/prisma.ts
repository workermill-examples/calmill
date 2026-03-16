// PrismaClient singleton with PrismaNeon adapter for Prisma 7

import { PrismaClient } from "@/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
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

  // Pass config object to PrismaNeon — NOT a Pool instance.
  // PrismaNeon creates its own Pool internally from the config.
  const adapter = new PrismaNeon({ connectionString });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// Lazy initialization via Proxy — defers Pool creation to first database call
function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrismaClient() as any)[prop];
  },
});

export default prisma;
